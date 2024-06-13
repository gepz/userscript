import WrappedApp from '@userscript/ui/WrappedApp';
import {
  BroadcastChannel,
} from 'broadcast-channel';
import {
  diff,
} from 'deep-diff';
import {
  Array as A,
  Duration as D,
  Effect as Z,
  Option as O,
  LogLevel,
  pipe,
  flow,
} from 'effect';
import {
  strict,
} from 'effect/Equivalence';
import {
  apply,
  identity,
} from 'effect/Function';
import {
  Dispatchable,
} from 'hyperapp';
import {
  asyncScheduler,
  EMPTY,
  fromEvent,
  interval,
  merge,
  Subject,
  filter,
  first,
  map,
  delay,
  switchMap,
  startWith,
  observeOn,
  retry,
  throttleTime,
  distinctUntilChanged,
  skip,
  bufferCount,
  of,
  Observable,
  concatMap,
  from,
  BehaviorSubject,
} from 'rxjs';

import ConfigObservable from '@/ConfigObservable';
import LivePageState from '@/LivePageState';
import MainState from '@/MainState';
import SettingState from '@/SettingState';
import UserConfig from '@/UserConfig';
import UserConfigSetter from '@/UserConfigSetter';
import configKeys from '@/configKeys';
import configStream from '@/configStream';
import listeningBroadcastConfigKeys from '@/listeningBroadcastConfigKeys';
import logWithMeta from '@/logWithMeta';
import mainCss from '@/mainCss';
import observePair from '@/observePair';
import onChatFieldMutate from '@/onChatFieldMutate';
import onPlayerResize from '@/onPlayerResize';
import removeOldChats from '@/removeOldChats';
import setChatPlayState from '@/setChatPlayState';
import settingsPanelSize from '@/settingsPanelSize';
import tapEffect from '@/tapEffect';
import updateSettingsRect from '@/updateSettingsRect';
import videoToggleStream from '@/videoToggleStream';

export default (
  provideLog: <T>(x: Z.Effect<T>) => Z.Effect<T>,
): (ctx: {
    updateSettingState: (
      dispatchable: Dispatchable<SettingState>,
    ) => Z.Effect<void>,
    setChangedConfig: UserConfigSetter,
    co: ConfigObservable,
    mainState: MainState,
    channel: BroadcastChannel<[keyof UserConfig, UserConfig[keyof UserConfig]]>,
    reinitSubject: Subject<void>,
    reinitialize: Z.Effect<void>,
    apps: {
      toggleChatButtonApp: WrappedApp<SettingState>,
      settingsApp: WrappedApp<SettingState>,
      toggleSettingsPanelApp: WrappedApp<SettingState>,
    },
    live: LivePageState,
    chatScreen: HTMLDivElement,
  }) => Z.Effect<Observable<unknown>> => flow(
  // eslint-disable-next-line func-names
  (ctx) => Z.gen(function* () {
    return {
      ...ctx,
      eq: O.getEquivalence(strict()),
      ...pipe(
        new BehaviorSubject(new DOMRectReadOnly(
          0,
          0,
          settingsPanelSize.width,
          settingsPanelSize.height,
        )),
        (settingsRectSubject) => ({
          settingsRectSubject,
          tapUpdateSettingsRect: <T>(ob: Observable<T>) => switchMap(
            (value: T) => pipe(
              settingsRectSubject,
              first(),
              map(updateSettingsRect(ctx.apps.toggleSettingsPanelApp.node)(
                (rect) => Z.sync(() => settingsRectSubject.next(rect)),
              )),
              tapEffect(provideLog),
              map(() => value),
            ),
          )(ob),
        }),
      ),
      config$: configStream(
        provideLog,
        ctx.mainState,
        ctx.co,
        ctx.chatScreen,
        ctx.live,
      ),
      css: yield* mainCss,
      documentMutationPair: yield* observePair(MutationObserver),
      chatMutationPair: yield* observePair(MutationObserver),
      playerResizePair: yield* observePair(ResizeObserver),
      bodyResizePair: yield* observePair(ResizeObserver),
      // eslint-disable-next-line @typescript-eslint/consistent-type-assertions
      liveElementKeys: Object.keys(ctx.live) as (keyof typeof ctx.live)[],
    };
  }),
  Z.map((c) => pipe(
    c.reinitSubject,
    observeOn(asyncScheduler),
    pipe(
      D.millis(100),
      (initDelay) => delay(D.toMillis(initDelay)),
    ),
    tapEffect(() => provideLog(Z.logInfo('Init'))),
    switchMap(() => pipe(
      D.millis(700),
      (changeDetectInterval) => interval(D.toMillis(changeDetectInterval)),
      c.tapUpdateSettingsRect,
      concatMap((index) => pipe(
        from(Z.runPromise(provideLog(pipe(
          Z.succeed(c.liveElementKeys),
          Z.flatMap(Z.forEach((key) => c.live[key].read.pipe(
            Z.option,
            Z.flatMap(O.liftPredicate(
              (newEle) => !c.eq(c.live[key].ele, newEle),
            )),
            Z.tap((x) => Z.sync(() => {
              // eslint-disable-next-line no-param-reassign
              c.live[key].ele = x;
            })),
            Z.map(O.isSome),
            Z.map((x) => `${key} ${x ? 'found' : 'lost'}`),
            Z.flatMap(Z.logDebug),
            Z.isSuccess,
          ))),
          Z.map(A.some<boolean>(identity)),
        )))),
        filter(identity),
        map(() => index),
      )),
      startWith(0),
    )),
    tapEffect(() => provideLog(pipe(
      Z.logDebug('Loading...'),
      Z.zipRight(
        Z.sync(() => {
          c.documentMutationPair.observer.disconnect();
          c.documentMutationPair.observer.observe(document, {
            childList: true,
            subtree: true,
          });

          c.chatMutationPair.observer.disconnect();
          c.playerResizePair.observer.disconnect();
          c.bodyResizePair.observer.disconnect();
          document.head.append(c.css);
        }),
      ),
      Z.zipRight(Z.allSuccesses([
        c.live.chatField.ele.pipe(
          Z.flatMap((x) => Z.sync(() => c.chatMutationPair.observer.observe(x, {
            childList: true,
          }))),
        ),
        c.live.chatTicker.ele.pipe(
          Z.flatMap((x) => Z.sync(() => c.chatMutationPair.observer.observe(x, {
            childList: true,
          }))),
        ),
        c.live.player.ele.pipe(
          Z.flatMap((element) => pipe(
            Z.succeed(element),
            Z.tap((x) => Z.sync(() => c.playerResizePair.observer.observe(x))),
            Z.flatMap((x) => Z.sync(() => x.prepend(c.chatScreen))),
          )),
        ),
        c.live.toggleChatBtnParent.ele.pipe(
          Z.flatMap((x) => Z.sync(() => x.prepend(
            c.apps.toggleChatButtonApp.node,
          ))),
        ),
        c.live.settingsToggleNextElement.ele.pipe(
          Z.flatMap((x) => Z.sync(() => x.before(
            c.apps.toggleSettingsPanelApp.node,
          ))),
          Z.orElse(() => c.live.toggleChatBtnParent.ele.pipe(
            Z.flatMap(() => Z.sync(
              () => c.apps.toggleChatButtonApp.node.before(
                c.apps.toggleSettingsPanelApp.node,
              ),
            )),
          )),
        ),
        c.live.settingsContainer.ele.pipe(
          Z.flatMap((x) => Z.sync(() => x.append(c.apps.settingsApp.node))),
        ),
        pipe(
          document.body,
          Z.fromNullable,
          Z.flatMap((x) => Z.sync(() => c.bodyResizePair.observer.observe(x))),
        ),
        c.live.video.ele.pipe(
          Z.filterOrElse(
            (x) => !x.paused,
            () => c.live.offlineSlate.ele,
          ),
          Z.isSuccess,
          Z.flatMap((x) => Z.sync(() => c.mainState.chatPlaying.next(x))),
        ),
      ])),
    ))),
    switchMap(() => merge(
      pipe(
        c.mainState.flowChats,
        map((x) => Z.logDebug(`flowChats length: ${x.length}`)),
        tapEffect(provideLog),
      ),
      pipe(
        fromEvent(c.channel, 'message'),
        map(([key, val]) => pipe(
          listeningBroadcastConfigKeys.includes(key),
          // eslint-disable-next-line max-len
          // eslint-disable-next-line @typescript-eslint/consistent-type-assertions
          (x) => (x ? c.setChangedConfig[key](val as never)
          : Z.sync(() => { })),
        )),
        tapEffect(provideLog),
      ),
      ...pipe(
        configKeys,
        A.map((key) => pipe(
          // eslint-disable-next-line max-len
          // eslint-disable-next-line @typescript-eslint/consistent-type-assertions
          (c.co[key] as Subject<unknown>),
          startWith(c.mainState.config.value[key]),
          bufferCount(2, 1),
          map(([x, y]) => diff(x, y)),
          map((x) => Z.logDebug(
            `Config ${key}: ${JSON.stringify(x, undefined, 2)}`,
          )),
          tapEffect(provideLog),
        )),
      ),
      c.config$,
      c.live.video.ele.pipe(
        O.match({
          onNone: () => EMPTY,
          onSome: (element) => pipe(
            videoToggleStream(element),
            map((playing) => playing || O.isSome(c.live.offlineSlate.ele)),
            map((chatPlaying) => pipe(
              Z.sync(() => c.mainState.chatPlaying.next(chatPlaying)),
              Z.zipRight(pipe(
                Z.succeed(c.mainState.flowChats.value),
                Z.map(A.map(setChatPlayState)),
                Z.flatMap(Z.forEach(apply(c.mainState))),
              )),
            )),
            tapEffect(provideLog),
          ),
        }),
      ),
      pipe(
        c.chatMutationPair.subject,
        map(onChatFieldMutate(c.chatScreen, c.mainState)),
        tapEffect(provideLog),
      ),
      pipe(
        c.documentMutationPair.subject,
        map(() => window.location.href),
        distinctUntilChanged(),
        skip(1),
        c.tapUpdateSettingsRect,
        map((x) => Z.all([
          Z.logDebug(`URL Changed: ${x}`),
          removeOldChats(c.mainState.flowChats)(0),
        ])),
        tapEffect(provideLog),
        pipe(
          D.millis(1700),
          (urlDelay) => delay(D.toMillis(urlDelay)),
        ),
        tapEffect(() => c.reinitialize),
      ),
      pipe(
        c.playerResizePair.subject,
        throttleTime(500, undefined, {
          leading: true,
          trailing: true,
        }),
        startWith([]),
        map(() => c.live.player.ele.pipe(
          O.map((x) => x.getBoundingClientRect()),
          O.match({
            onNone: () => Z.void,
            onSome: (x) => onPlayerResize(x, c.mainState),
          }),
        )),
        tapEffect(provideLog),
      ),
      pipe(
        c.bodyResizePair.subject,
        pipe(
          D.millis(300),
          (bodyResizeDetectInterval) => throttleTime(
            D.toMillis(bodyResizeDetectInterval),
            undefined,
            {
              leading: true,
              trailing: true,
            },
          ),
        ),
        startWith([]),
        c.tapUpdateSettingsRect,
      ),
      pipe(
        c.settingsRectSubject,
        tapEffect((panelRect) => c.updateSettingState((s) => ({
          ...s,
          panelRect,
        }))),
      ),
    )),
    retry({
      delay: (e) => pipe(
        of(e),
        tapEffect(() => provideLog(
          // eslint-disable-next-line max-len
          // eslint-disable-next-line @typescript-eslint/restrict-template-expressions
          logWithMeta(LogLevel.Error)(`Errored: ${e}`)(e),
        )),
        pipe(
          D.millis(5000),
          (errorRetryInterval) => delay(D.toMillis(errorRetryInterval)),
        ),
        tapEffect(() => c.reinitialize),
      ),
    }),
  )),
);
