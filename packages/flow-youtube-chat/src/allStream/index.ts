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
  Schedule,
  LogLevel,
  Stream,
  pipe,
} from 'effect';
import {
  apply,
  identity,
} from 'effect/Function';
import {
  Dispatchable,
} from 'hyperapp';

import ConfigRefs from '@/ConfigRefs';
import {
  makePageState,
} from '@/LivePageState';
import MainState from '@/MainState';
import SettingState from '@/SettingState';
import UserConfig from '@/UserConfig';
import UserConfigSetter from '@/UserConfigSetter';
import configDiff from '@/configDiff';
import configKeys from '@/configKeys';
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

export default (
  provideLog: <T>(x: Z.Effect<T>) => Z.Effect<T>,
) => (ctx: {
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
  // eslint-disable-next-line func-names
}): Z.Effect<Stream.Stream<unknown>> => Z.gen(function* () {
  const live = makePageState(livePageYt);
  const css = yield * mainCss;
  const documentMutationPair = yield * observePair(MutationObserver);
  const chatMutationPair = yield * observePair(MutationObserver);
  const playerResizePair = yield * observePair(ResizeObserver);
  const bodyResizePair = yield * observePair(ResizeObserver);
  // eslint-disable-next-line @typescript-eslint/consistent-type-assertions
  const liveElementKeys = Object.keys(live) as (keyof typeof live)[];
  const settingsRect = yield * SubscriptionRef.make(new DOMRectReadOnly(
    0,
    0,
    settingsPanelSize.width,
    settingsPanelSize.height,
  ));

  const tapUpdateSettingsRect = <T, E, R>(
    stream: Stream.Stream<T, E, R>,
  ): Stream.Stream<T, E, R> => Stream.tap(stream, () => provideLog(pipe(
    SubscriptionRef.get(settingsRect),
    Z.flatMap(updateSettingsRect(ctx.apps.toggleSettingsPanelApp.node)(
      (rect) => SubscriptionRef.set(settingsRect, rect),
    )),
  )));

  const config$ = configStream(
    provideLog,
    ctx.mainState,
    ctx.configRefs,
    ctx.chatScreen,
    live,
  );

  const pollChanged = provideLog(pipe(
    Z.succeed(liveElementKeys),
    Z.flatMap(Z.forEach((key) => live[key].read.pipe(
      Z.option,
      Z.flatMap(O.liftPredicate(
        (newEle) => !strictOptionEquivalence(live[key].ele, newEle),
      )),
      Z.tap((x) => Z.sync(() => {
        live[key].ele = x;
      })),
      Z.map(O.isSome),
      Z.map((x) => `${key} ${x ? 'found' : 'lost'}`),
      Z.flatMap(Z.logDebug),
      Z.isSuccess,
    ))),
    Z.map(A.some<boolean>(identity)),
  ));

  const setup = provideLog(pipe(
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
      ...A.map(
        [live.chatField.ele, live.chatTicker.ele],
        Z.flatMap((x) => Z.sync(
          () => chatMutationPair.observer.observe(x, {
            childList: true,
          }),
        )),
      ),
      live.player.ele.pipe(
        Z.flatMap((element) => pipe(
          Z.succeed(element),
          Z.tap((x) => Z.sync(() => playerResizePair.observer.observe(x))),
          Z.flatMap((x) => Z.sync(() => x.prepend(ctx.chatScreen))),
        )),
      ),
      live.toggleChatBtnParent.ele.pipe(
        Z.flatMap((x) => Z.sync(() => x.prepend(
          ctx.apps.toggleChatButtonApp.node,
        ))),
      ),
      live.settingsToggleNextElement.ele.pipe(
        Z.flatMap((x) => Z.sync(() => x.before(
          ctx.apps.toggleSettingsPanelApp.node,
        ))),
        Z.orElse(() => live.toggleChatBtnParent.ele.pipe(
          Z.flatMap(() => Z.sync(
            () => ctx.apps.toggleChatButtonApp.node.before(
              ctx.apps.toggleSettingsPanelApp.node,
            ),
          )),
        )),
      ),
      live.settingsContainer.ele.pipe(
        Z.flatMap((x) => Z.sync(() => x.append(ctx.apps.settingsApp.node))),
      ),
      pipe(
        document.body,
        Z.fromNullable,
        Z.flatMap((x) => Z.sync(() => bodyResizePair.observer.observe(x))),
      ),
      live.video.ele.pipe(
        Z.filterOrElse(
          (x) => !x.paused,
          () => live.offlineSlate.ele,
        ),
        Z.isSuccess,
        Z.flatMap((x) => SynchronizedRef.set(ctx.mainState.chatPlaying, x)),
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
      Stream.mapEffect(([key, val]) => provideLog(pipe(
        listeningBroadcastConfigKeys.includes(key),
        (x) => (x
          // eslint-disable-next-line @typescript-eslint/consistent-type-assertions
          ? ctx.setChangedConfig[key](val as never)
          : Z.sync(() => { })),
      ))),
    ),
    ...pipe(
      configKeys,
      A.map((key) => pipe(
        // eslint-disable-next-line @typescript-eslint/consistent-type-assertions
        (ctx.configRefs[key] as SubscriptionRef.SubscriptionRef<unknown>)
          .changes,
        Stream.zipWithPrevious,
        Stream.filterMap(([previous, next]) => O.map(
          previous,
          (x) => configDiff(x, next),
        )),
        Stream.mapEffect((x) => provideLog(Z.logDebug(
          `Config ${key}: ${JSON.stringify(x, undefined, 2)}`,
        ))),
      )),
    ),
    config$,
    live.video.ele.pipe(
      O.match({
        onNone: () => Stream.empty,
        onSome: (element) => pipe(
          videoToggleStream(element),
          Stream.map((playing) => playing || O.isSome(live.offlineSlate.ele)),
          Stream.mapEffect((chatPlaying) => provideLog(pipe(
            SynchronizedRef.set(ctx.mainState.chatPlaying, chatPlaying),
            Z.zipRight(pipe(
              SynchronizedRef.get(ctx.mainState.flowChats),
              Z.map(A.map(setChatPlayState)),
              Z.flatMap(Z.forEach(apply(ctx.mainState))),
            )),
          ))),
        ),
      }),
    ),
    pipe(
      chatMutationPair.stream,
      Stream.mapEffect((records) => provideLog(
        onChatFieldMutate(ctx.chatScreen, ctx.mainState)(records),
      )),
    ),
    pipe(
      documentMutationPair.stream,
      Stream.map(() => window.location.href),
      Stream.changes,
      Stream.drop(1),
      tapUpdateSettingsRect,
      Stream.mapEffect((x) => provideLog(Z.all([
        Z.logDebug(`URL Changed: ${x}`),
        removeOldChats(ctx.mainState.flowChats)(0),
      ]))),
      Stream.mapEffect(() => pipe(
        Z.sleep('1700 millis'),
        Z.zipRight(ctx.reinitialize),
      )),
    ),
    pipe(
      playerResizePair.stream,
      throttleLatest('500 millis'),
      (s) => Stream.concat(Stream.succeed([]), s),
      Stream.mapEffect(() => provideLog(live.player.ele.pipe(
        O.map((x) => x.getBoundingClientRect()),
        O.match({
          onNone: () => Z.void,
          onSome: (x) => onPlayerResize(x, ctx.mainState),
        }),
      ))),
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
      Z.zipRight(provideLog(Z.logInfo('Init'))),
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
        provideLog(logWithMeta(LogLevel.Error)(
          `Errored: ${Cause.pretty(cause)}`,
        )(Cause.squash(cause))),
        Z.zipRight(Z.sleep('5 seconds')),
        Z.zipRight(ctx.reinitialize),
        Z.as(resilient(self)),
      ))),
    )
  );

  return resilient(main);
});
