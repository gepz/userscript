import {
  strict,
} from '@effect/data/Equivalence';
import {
  pipe,
  apply,
  identity,
} from '@effect/data/Function';
import * as O from '@effect/data/Option';
import * as RA from '@effect/data/ReadonlyArray';
import * as Z from '@effect/io/Effect';
import * as LogLevel from '@effect/io/Logger/Level';
import {
  BroadcastChannel,
} from 'broadcast-channel';
import {
  diff,
} from 'deep-diff';
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
import LivePage from '@/LivePage';
import LivePageState from '@/LivePageState';
import MainState from '@/MainState';
import SettingState from '@/SettingState';
import UserConfig from '@/UserConfig';
import UserConfigGetter from '@/UserConfigGetter';
import UserConfigSetter from '@/UserConfigSetter/index';
import WrappedApp from '@/WrappedApp/index';
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

type Ctx = {
  updateSettingState: (
    dispatchable: Dispatchable<SettingState>,
  ) => Z.Effect<never, never, void>,
  configKeys: (keyof UserConfig)[],
  config: UserConfig,
  getConfig: UserConfigGetter,
  setConfig: UserConfigSetter,
  setChangedConfig: UserConfigSetter,
  co: ConfigObservable,
  mainState: MainState,
  channel: BroadcastChannel<[keyof UserConfig, UserConfig[keyof UserConfig]]>,
  reinitSubject: Subject<void>,
  reinitialize: Z.Effect<never, never, void>,
  wrappedToggleChat: WrappedApp<SettingState>,
  wrappedSettings: WrappedApp<SettingState>,
  wrappedToggleSettings: WrappedApp<SettingState>,
  liveElementKeys: (keyof LivePage)[],
  live: LivePageState,
  chatScreen: HTMLDivElement,
};

export default (
  {
    updateSettingState,
    configKeys,
    config,
    getConfig,
    setConfig,
    setChangedConfig,
    co,
    mainState,
    channel,
    reinitSubject,
    reinitialize,
    wrappedToggleChat,
    wrappedSettings,
    wrappedToggleSettings,
    liveElementKeys,
    live,
    chatScreen,
  }: Ctx,
  provideLog: <T>(x: Z.Effect<never, never, T>) => Z.Effect<never, never, T>,
): Z.Effect<never, never, Observable<unknown>> => pipe(
  {
    eq: O.getEquivalence(strict()),
    initDelay: 100,
    urlDelay: 1700,
    changeDetectInterval: 700,
    bodyResizeDetectInterval: 300,
    errorRetryInterval: 5000,
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
            map(updateSettingsRect(wrappedToggleSettings.node)(
              (rect) => Z.sync(() => settingsRectSubject.next(rect)),
            )),
            tapEffect(provideLog),
            map(() => value),
          ),
        )(ob),
      }),
    ),
    co,
    config$: configStream(
      provideLog,
      mainState,
      co,
      chatScreen,
      live,
    ),
  },
  Z.succeed,
  Z.bind('css', () => mainCss),
  Z.bind('documentMutationPair', () => observePair(MutationObserver)),
  Z.bind('chatMutationPair', () => observePair(MutationObserver)),
  Z.bind('playerResizePair', () => observePair(ResizeObserver)),
  Z.bind('bodyResizePair', () => observePair(ResizeObserver)),
  Z.map((c) => pipe(
    reinitSubject,
    observeOn(asyncScheduler),
    delay(c.initDelay),
    tapEffect(() => provideLog(Z.log({
      level: 'Info',
    })('Init'))),
    switchMap(() => pipe(
      interval(c.changeDetectInterval),
      c.tapUpdateSettingsRect,
      concatMap((index) => pipe(
        from(Z.runPromise(provideLog(pipe(
          liveElementKeys,
          RA.map((key) => pipe(
            live[key].read,
            Z.option,
            Z.flatMap(O.liftPredicate(
              (newEle) => !c.eq(live[key].ele, newEle),
            )),
            Z.tap((x) => Z.sync(() => {
              // eslint-disable-next-line no-param-reassign
              live[key].ele = x;
            })),
            Z.map(O.isSome),
            Z.map((x) => `${key} ${x ? 'found' : 'lost'}`),
            Z.flatMap(Z.log({
              level: 'Debug',
            })),
            Z.isSuccess,
          )),
          (x) => Z.all(x),
          Z.map(RA.some(identity)),
        )))),
        filter(identity),
        map(() => index),
      )),
      startWith(0),
    )),
    tapEffect(() => provideLog(pipe(
      Z.log({
        level: 'Debug',
      })('Loading...'),
      Z.zipRight(removeOldChats(mainState.flowChats)(0)),
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
      Z.zipRight(pipe(
        [
          pipe(
            live.chatField.ele,
            O.map((x) => Z.sync(() => c.chatMutationPair.observer.observe(x, {
              childList: true,
            }))),
          ),
          pipe(
            live.chatTicker.ele,
            O.map((x) => Z.sync(() => c.chatMutationPair.observer.observe(x, {
              childList: true,
            }))),
          ),
          pipe(
            live.player.ele,
            O.map((element) => pipe(
              element,
              Z.succeed,
              Z.tap((x) => Z.sync(
                () => c.playerResizePair.observer.observe(x),
              )),
              Z.flatMap((x) => Z.sync(() => x.prepend(chatScreen))),
            )),
          ),
          pipe(
            live.toggleChatBtnParent.ele,
            O.map((x) => Z.sync(() => x.prepend(wrappedToggleChat.node))),
          ),
          pipe(
            live.settingsToggleNextElement.ele,
            O.map((x) => Z.sync(() => x.before(wrappedToggleSettings.node))),
          ),
          pipe(
            live.settingsContainer.ele,
            O.map((x) => Z.sync(() => x.append(wrappedSettings.node))),
          ),
          pipe(
            document.body,
            O.fromNullable,
            O.map((x) => Z.sync(() => c.bodyResizePair.observer.observe(x))),
          ),
        ],
        RA.compact,
        RA.append(pipe(
          live.video.ele,
          O.filter((x) => !x.paused),
          O.orElse(() => live.offlineSlate.ele),
          O.isSome,
          (x) => Z.sync(() => mainState.chatPlaying.next(x)),
        )),
        (x) => Z.all(x),
      )),
    ))),
    switchMap(() => merge(
      pipe(
        fromEvent(channel, 'message'),
        map(([key, val]) => pipe(
          listeningBroadcastConfigKeys.includes(key),
          // eslint-disable-next-line max-len
          // eslint-disable-next-line @typescript-eslint/consistent-type-assertions
          (x) => (x ? setChangedConfig[key](val as never)
          : Z.sync(() => { })),
        )),
        tapEffect(provideLog),
      ),
      ...pipe(
        configKeys,
        RA.map((key) => pipe(
          // eslint-disable-next-line max-len
          // eslint-disable-next-line @typescript-eslint/consistent-type-assertions
          (co[key] as Subject<unknown>),
          startWith(config[key]),
          bufferCount(2, 1),
          map(([x, y]) => diff(x, y)),
          map((x) => Z.log({
            level: 'Debug',
          })(
            `Config ${key}: ${JSON.stringify(x, undefined, 2)}`,
          )),
          tapEffect(provideLog),
        )),
      ),
      c.config$,
      pipe(
        live.video.ele,
        O.match({
          onNone: () => EMPTY,
          onSome: (element) => pipe(
            element,
            videoToggleStream,
            map((playing) => playing || O.isSome(live.offlineSlate.ele)),
            map((chatPlaying) => pipe(
              Z.sync(() => mainState.chatPlaying.next(chatPlaying)),
              Z.zipRight(pipe(
                mainState.flowChats.value,
                RA.map(setChatPlayState),
                RA.map(apply(mainState)),
                (x) => Z.all(x),
              )),
            )),
            tapEffect(provideLog),
          ),
        }),
      ),
      pipe(
        c.chatMutationPair.subject,
        map(onChatFieldMutate(
          chatScreen,
          mainState,
          getConfig,
          setConfig,
        )),
        tapEffect(provideLog),
      ),
      pipe(
        c.documentMutationPair.subject,
        map(() => window.location.href),
        distinctUntilChanged(),
        skip(1),
        c.tapUpdateSettingsRect,
        map((x) => Z.all([
          Z.log({
            level: 'Debug',
          })(`URL Changed: ${x}`),
          removeOldChats(mainState.flowChats)(0),
          Z.log({
            level: 'Debug',
          })(`Wait for ${c.urlDelay}ms...`),
        ])),
        tapEffect(provideLog),
        delay(c.urlDelay),
        tapEffect(() => reinitialize),
      ),
      pipe(
        c.playerResizePair.subject,
        throttleTime(500, undefined, {
          leading: true,
          trailing: true,
        }),
        startWith([]),
        map((stream) => pipe(
          stream,
          () => live.player.ele,
          O.map((x) => x.getBoundingClientRect()),
          O.match({
            onNone: () => Z.unit,
            onSome: (x) => onPlayerResize(x, mainState),
          }),
        )),
        tapEffect(provideLog),

      ),
      pipe(
        c.bodyResizePair.subject,
        throttleTime(c.bodyResizeDetectInterval, undefined, {
          leading: true,
          trailing: true,
        }),
        startWith([]),
        c.tapUpdateSettingsRect,
      ),
      pipe(
        c.settingsRectSubject,
        tapEffect((panelRect) => updateSettingState((s) => ({
          ...s,
          panelRect,
        }))),
      ),
    )),
    retry({
      delay: (e) => pipe(
        e,
        of,
        tapEffect(() => provideLog(
          // eslint-disable-next-line max-len
          // eslint-disable-next-line @typescript-eslint/restrict-template-expressions
          logWithMeta(LogLevel.Error)(`Errored: ${e}`)(e),
        )),
        delay(c.errorRetryInterval),
        tapEffect(() => reinitialize),
      ),
    }),
  )),
);
