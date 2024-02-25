import WrappedApp from '@userscript/ui/WrappedApp';
import {
  BroadcastChannel,
} from 'broadcast-channel';
import {
  diff,
} from 'deep-diff';
import * as D from 'effect/Duration';
import * as Z from 'effect/Effect';
import {
  strict,
} from 'effect/Equivalence';
import {
  pipe,
  apply,
  identity,
} from 'effect/Function';
import * as LogLevel from 'effect/LogLevel';
import * as O from 'effect/Option';
import * as RA from 'effect/ReadonlyArray';
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

type Ctx = {
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
  liveElementKeys: (keyof LivePage)[],
  live: LivePageState,
  chatScreen: HTMLDivElement,
};

export default (
  {
    updateSettingState,
    setChangedConfig,
    co,
    mainState,
    channel,
    reinitSubject,
    reinitialize,
    apps: {
      toggleChatButtonApp,
      settingsApp,
      toggleSettingsPanelApp,
    },
    liveElementKeys,
    live,
    chatScreen,
  }: Ctx,
  provideLog: <T>(x: Z.Effect<T>) => Z.Effect<T>,
): Z.Effect<Observable<unknown>> => pipe(
  // eslint-disable-next-line func-names
  Z.gen(function* (_) {
    return {
      eq: O.getEquivalence(strict()),
      initDelay: D.millis(100),
      urlDelay: D.millis(1700),
      changeDetectInterval: D.millis(700),
      bodyResizeDetectInterval: D.millis(300),
      errorRetryInterval: D.millis(5000),
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
              map(updateSettingsRect(toggleSettingsPanelApp.node)(
                (rect) => Z.sync(() => settingsRectSubject.next(rect)),
              )),
              tapEffect(provideLog),
              map(() => value),
            ),
          )(ob),
        }),
      ),
      config$: configStream(provideLog, mainState, co, chatScreen, live),
      css: yield* _(mainCss),
      documentMutationPair: yield* _(observePair(MutationObserver)),
      chatMutationPair: yield* _(observePair(MutationObserver)),
      playerResizePair: yield* _(observePair(ResizeObserver)),
      bodyResizePair: yield* _(observePair(ResizeObserver)),
    };
  }),
  Z.map((c) => pipe(
    reinitSubject,
    observeOn(asyncScheduler),
    delay(D.toMillis(c.initDelay)),
    tapEffect(() => provideLog(Z.logInfo('Init'))),
    switchMap(() => pipe(
      interval(D.toMillis(c.changeDetectInterval)),
      c.tapUpdateSettingsRect,
      concatMap((index) => pipe(
        from(Z.runPromise(provideLog(pipe(
          liveElementKeys,
          RA.map((key) => live[key].read.pipe(
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
            Z.flatMap(Z.logDebug),
            Z.isSuccess,
          )),
          Z.all,
          Z.map(RA.some<boolean>(identity)),
        )))),
        filter(identity),
        map(() => index),
      )),
      startWith(0),
    )),
    tapEffect(() => provideLog(pipe(
      Z.logDebug('Loading...'),
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
          live.chatField.ele.pipe(
            O.map((x) => Z.sync(() => c.chatMutationPair.observer.observe(x, {
              childList: true,
            }))),
          ),
          live.chatTicker.ele.pipe(
            O.map((x) => Z.sync(() => c.chatMutationPair.observer.observe(x, {
              childList: true,
            }))),
          ),
          live.player.ele.pipe(
            O.map((element) => pipe(
              Z.succeed(element),
              Z.tap((x) => Z.sync(
                () => c.playerResizePair.observer.observe(x),
              )),
              Z.flatMap((x) => Z.sync(() => x.prepend(chatScreen))),
            )),
          ),
          live.toggleChatBtnParent.ele.pipe(
            O.map((x) => Z.sync(() => x.prepend(toggleChatButtonApp.node))),
          ),
          live.settingsToggleNextElement.ele.pipe(
            O.map((x) => Z.sync(() => x.before(toggleSettingsPanelApp.node))),
          ),
          live.settingsContainer.ele.pipe(
            O.map((x) => Z.sync(() => x.append(settingsApp.node))),
          ),
          pipe(
            document.body,
            O.fromNullable,
            O.map((x) => Z.sync(() => c.bodyResizePair.observer.observe(x))),
          ),
        ],
        RA.getSomes,
        RA.append(live.video.ele.pipe(
          O.filter((x) => !x.paused),
          O.orElse(() => live.offlineSlate.ele),
          O.isSome,
          (x) => Z.sync(() => mainState.chatPlaying.next(x)),
        )),
        Z.all,
      )),
    ))),
    switchMap(() => merge(
      pipe(
        mainState.flowChats,
        map((x) => Z.logDebug(`flowChats length: ${x.length}`)),
        tapEffect(provideLog),
      ),
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
          startWith(mainState.config.value[key]),
          bufferCount(2, 1),
          map(([x, y]) => diff(x, y)),
          map((x) => Z.logDebug(
            `Config ${key}: ${JSON.stringify(x, undefined, 2)}`,
          )),
          tapEffect(provideLog),
        )),
      ),
      c.config$,
      live.video.ele.pipe(
        O.match({
          onNone: () => EMPTY,
          onSome: (element) => pipe(
            videoToggleStream(element),
            map((playing) => playing || O.isSome(live.offlineSlate.ele)),
            map((chatPlaying) => pipe(
              Z.sync(() => mainState.chatPlaying.next(chatPlaying)),
              Z.zipRight(pipe(
                mainState.flowChats.value,
                RA.map(setChatPlayState),
                RA.map(apply(mainState)),
                Z.all,
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
          Z.logDebug(`URL Changed: ${x}`),
          removeOldChats(mainState.flowChats)(0),
          Z.logDebug(`Wait for ${D.toMillis(c.urlDelay)}ms...`),
        ])),
        tapEffect(provideLog),
        delay(D.toMillis(c.urlDelay)),
        tapEffect(() => reinitialize),
      ),
      pipe(
        c.playerResizePair.subject,
        throttleTime(500, undefined, {
          leading: true,
          trailing: true,
        }),
        startWith([]),
        map(() => live.player.ele.pipe(
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
        throttleTime(D.toMillis(c.bodyResizeDetectInterval), undefined, {
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
        of(e),
        tapEffect(() => provideLog(
          // eslint-disable-next-line max-len
          // eslint-disable-next-line @typescript-eslint/restrict-template-expressions
          logWithMeta(LogLevel.Error)(`Errored: ${e}`)(e),
        )),
        delay(D.toMillis(c.errorRetryInterval)),
        tapEffect(() => reinitialize),
      ),
    }),
  )),
);

