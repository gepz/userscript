import WrappedApp from '@userscript/ui/WrappedApp';
import {
  BroadcastChannel,
} from 'broadcast-channel';
import {
  SynchronizedRef,
  SubscriptionRef,
  Array as A,
  Cause,
  Effect as Z,
  Option as O,
  Queue,
  Record as R,
  Schedule,
  LogLevel,
  Stream,
  Struct,
  pipe,
} from 'effect';
import {
  apply,
  identity,
} from 'effect/Function';
import {
  Dispatchable,
} from 'hyperapp';

import {
  emptyAuthorNames,
} from '@/AuthorNameIndex';
import ConfigRefs from '@/ConfigRefs';
import {
  makePageState,
} from '@/LivePageState';
import MainState from '@/MainState';
import SettingState from '@/SettingState';
import UserConfig from '@/UserConfig';
import UserConfigSetter from '@/UserConfigSetter';
import configDiff from '@/configDiff';
import configStream from '@/configStream';
import listeningBroadcastConfigKeys from '@/listeningBroadcastConfigKeys';
import livePageYt from '@/livePageYt';
import logWithMeta from '@/logWithMeta';
import mainCss from '@/mainCss';
import onChatFieldMutate from '@/onChatFieldMutate';
import onPlayerResize from '@/onPlayerResize';
import removeOldChats from '@/removeOldChats';
import setChatPlayState from '@/setChatPlayState';
import settingsPanelSize from '@/settingsPanelSize';
import observePair from '@/stream/observePair';
import throttleLatest from '@/stream/throttleLatest';
import videoToggleStream from '@/stream/videoToggleStream';
import strictOptionEquivalence from '@/strictOptionEquivalence';
import updateSettingsRect from '@/updateSettingsRect';

export default Z.fnUntraced(function* (ctx: {
  updateSettingState: (
    dispatchable: Dispatchable<SettingState>,
  ) => Z.Effect<void>
  setChangedConfig: UserConfigSetter
  configRefs: ConfigRefs
  mainState: MainState
  channel: BroadcastChannel<{ [K in keyof UserConfig]: [K, UserConfig[K]] }[
    keyof UserConfig
  ]>
  reinitQueue: Queue.Queue<void>
  reinitialize: Z.Effect<void>
  apps: {
    toggleChatButtonApp: WrappedApp<SettingState>
    settingsApp: WrappedApp<SettingState>
    toggleSettingsPanelApp: WrappedApp<SettingState>
  }
  chatScreen: HTMLDivElement
}) {
  const live = makePageState(livePageYt);
  const css = yield * mainCss;
  const documentMutationPair = yield * observePair(MutationObserver);
  const chatMutationPair = yield * observePair(MutationObserver);
  const playerResizePair = yield * observePair(ResizeObserver);
  const bodyResizePair = yield * observePair(ResizeObserver);
  const liveElementKeys = Struct.keys(live);
  const settingsRect = yield * SubscriptionRef.make(new DOMRectReadOnly(
    0,
    0,
    settingsPanelSize.width,
    settingsPanelSize.height,
  ));

  const tapUpdateSettingsRect = <T, E, R>(
    stream: Stream.Stream<T, E, R>,
  ): Stream.Stream<T, E, R> => Stream.tap(stream, () => pipe(
    SubscriptionRef.get(settingsRect),
    Z.flatMap(updateSettingsRect(ctx.apps.toggleSettingsPanelApp.node)(
      (rect) => SubscriptionRef.set(settingsRect, rect),
    )),
  ));

  const config$ = configStream(
    ctx.mainState,
    ctx.configRefs,
    ctx.chatScreen,
    live,
  );

  const pollChanged = pipe(
    Z.forEach(liveElementKeys, (key) => pipe(
      Z.option(live[key].read),
      Z.map(O.liftPredicate(
        (newEle) => !strictOptionEquivalence(live[key].ele, newEle),
      )),
      Z.flatMap(Z.transposeMapOption((newEle) => pipe(
        Z.sync(() => {
          live[key].ele = newEle;
        }),
        Z.zipRight(Z.logDebug(
          `${key} ${O.isSome(newEle) ? 'found' : 'lost'}`,
        )),
      ))),
      Z.map(O.isSome),
    )),
    Z.map(A.some<boolean>(identity)),
  );

  // Suspended so the element caches are read at run time: setup re-runs on
  // every emitted poll tick and must see the elements that tick just stored.
  // A plain pipe would capture the empty caches from construction and the
  // mounts would silently fail forever inside allSuccesses.
  const setup = Z.suspend(() => pipe(
    Z.logDebug('Loading...'),
    Z.zipRight(
      Z.sync(() => {
        [
          documentMutationPair,
          chatMutationPair,
          playerResizePair,
          bodyResizePair,
        ].forEach((pair) => {
          pair.observer.disconnect();
        });

        documentMutationPair.observer.observe(document, {
          childList: true,
          subtree: true,
        });

        document.head.append(css);
      }),
    ),
    Z.zipRight(Z.allSuccesses([
      // Only the message list feeds the flow: a superchat's ticker bubble
      // is a duplicate announcement of its list entry, so the ticker is
      // deliberately not observed.
      Z.transposeMapOption(live.chatField.ele, (x) => Z.sync(
        () => chatMutationPair.observer.observe(x, {
          childList: true,
        }),
      )),
      Z.transposeMapOption(live.player.ele, (x) => Z.sync(() => {
        playerResizePair.observer.observe(x);
        x.prepend(ctx.chatScreen);
      })),
      Z.transposeMapOption(live.toggleChatBtnParent.ele, (x) => Z.sync(
        () => x.prepend(ctx.apps.toggleChatButtonApp.node),
      )),
      pipe(
        live.settingsToggleNextElement.ele,
        O.map((x) => Z.sync(() => x.before(
          ctx.apps.toggleSettingsPanelApp.node,
        ))),
        O.orElse(() => O.map(
          live.toggleChatBtnParent.ele,
          () => Z.sync(() => ctx.apps.toggleChatButtonApp.node.before(
            ctx.apps.toggleSettingsPanelApp.node,
          )),
        )),
        Z.transposeOption,
      ),
      Z.transposeMapOption(live.settingsContainer.ele, (x) => Z.sync(
        () => x.append(ctx.apps.settingsApp.node),
      )),
      pipe(
        document.body,
        Z.fromNullable,
        Z.flatMap((x) => Z.sync(() => bodyResizePair.observer.observe(x))),
      ),
      pipe(
        live.video.ele,
        O.map((x) => !x.paused || O.isSome(live.offlineSlate.ele)),
        O.getOrElse(() => false),
        (x) => SynchronizedRef.set(ctx.mainState.chatPlaying, x),
      ),
    ])),
  ));

  // Branch streams are (re)constructed on every emitted poll tick, so
  // element caches read at construction time (e.g. live.video.ele) are
  // fresh.
  const branches = (): Stream.Stream<unknown>[] => [
    pipe(
      Stream.fromEventListener<{ [K in keyof UserConfig]: [K, UserConfig[K]] }[
        keyof UserConfig
      ]>(ctx.channel, 'message'),
      Stream.mapEffect(([key, val]) => pipe(
        listeningBroadcastConfigKeys.includes(key),
        (x) => (x
          // eslint-disable-next-line @typescript-eslint/consistent-type-assertions
          ? ctx.setChangedConfig[key](val as never)
          : Z.sync(() => { })),
      )),
    ),
    pipe(
      Stream.mergeWithTag(
        // Explicit <unknown> widens the per-key stream union covariantly (no
        // cast); the diff handler below is value-type-agnostic anyway.
        R.map(ctx.configRefs, (ref) => Stream.zipWithPrevious<
          unknown, never, never
        >(ref.changes)),
        {
          concurrency: 'unbounded',
        },
      ),
      // whenLogLevel gates the diff itself: configDiff + stringify cost
      // nothing unless debug logging is currently enabled.
      Stream.mapEffect(({
        _tag: key, value: [previous, next],
      }) => Z.whenLogLevel(
        Z.transposeMapOption(previous, (x) => Z.logDebug(
          `Config ${key}: ${
            JSON.stringify(configDiff(x, next), undefined, 2)}`,
        )),
        LogLevel.Debug,
      )),
    ),
    config$,
    live.video.ele.pipe(
      O.match({
        onNone: () => Stream.empty,
        onSome: (element) => pipe(
          videoToggleStream(element),
          Stream.map((playing) => playing || O.isSome(live.offlineSlate.ele)),
          Stream.mapEffect((chatPlaying) => pipe(
            SynchronizedRef.set(ctx.mainState.chatPlaying, chatPlaying),
            Z.zipRight(pipe(
              SynchronizedRef.get(ctx.mainState.flowChats),
              Z.map(A.map(setChatPlayState)),
              Z.flatMap(Z.forEach(apply(ctx.mainState))),
            )),
          )),
        ),
      }),
    ),
    pipe(
      chatMutationPair.stream,
      Stream.mapEffect(
        onChatFieldMutate(ctx.chatScreen, ctx.mainState),
      ),
    ),
    pipe(
      documentMutationPair.stream,
      Stream.map(() => window.location.href),
      Stream.changes,
      Stream.drop(1),
      tapUpdateSettingsRect,
      Stream.mapEffect((x) => Z.all([
        Z.logDebug(`URL Changed: ${x}`),
        removeOldChats(ctx.mainState.flowChats)(0),
        // Name observations are per stream; see AuthorNameIndex.
        SynchronizedRef.set(ctx.mainState.authorNames, emptyAuthorNames),
      ])),
      Stream.mapEffect(() => pipe(
        Z.sleep('1700 millis'),
        Z.zipRight(ctx.reinitialize),
      )),
    ),
    pipe(
      playerResizePair.stream,
      throttleLatest('500 millis'),
      (s) => Stream.concat(Stream.succeed([]), s),
      Stream.mapEffect(() => live.player.ele.pipe(
        O.map((x) => x.getBoundingClientRect()),
        O.match({
          onNone: () => Z.void,
          onSome: (x) => onPlayerResize(x, ctx.mainState),
        }),
      )),
    ),
    pipe(
      bodyResizePair.stream,
      throttleLatest('300 millis'),
      (s) => Stream.concat(Stream.succeed([]), s),
      tapUpdateSettingsRect,
    ),
    pipe(
      settingsRect.changes,
      Stream.mapEffect((panelRect) => ctx.updateSettingState((s) => ({
        ...s,
        panelRect,
      }))),
    ),
  ];

  const main: Stream.Stream<unknown> = pipe(
    Stream.fromQueue(ctx.reinitQueue),
    Stream.mapEffect(() => pipe(
      Z.sleep('100 millis'),
      Z.zipRight(Z.logInfo('Init')),
    )),
    Stream.flatMap(() => pipe(
      Stream.fromSchedule(Schedule.fixed('700 millis')),
      tapUpdateSettingsRect,
      Stream.mapEffect(() => pollChanged),
      Stream.filter(identity),
      (s) => Stream.concat(Stream.make(true), s),
      Stream.tap(() => setup),
      Stream.flatMap(() => Stream.mergeAll(branches(), {
        concurrency: 'unbounded',
      }), {
        switch: true,
      }),
    ), {
      switch: true,
    }),
  );

  // Counterpart of rxjs retry({delay}): recover from failures AND defects,
  // since a defect in any branch effect must not kill the pipeline for the
  // rest of the page's lifetime.
  const resilient = (self: Stream.Stream<unknown>): Stream.Stream<unknown> => (
    pipe(
      self,
      Stream.catchAllCause((cause) => Stream.unwrap(pipe(
        logWithMeta(LogLevel.Error)(
          `Errored: ${Cause.pretty(cause)}`,
        )(Cause.squash(cause)),
        Z.zipRight(Z.sleep('5 seconds')),
        Z.zipRight(ctx.reinitialize),
        Z.as(resilient(self)),
      ))),
    )
  );

  return resilient(main);
});
