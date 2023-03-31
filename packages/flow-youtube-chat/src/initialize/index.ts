import {
  pipe,
  apply,
  flow,
  identity,
} from '@effect/data/Function';
import * as O from '@effect/data/Option';
import * as RA from '@effect/data/ReadonlyArray';
import * as Str from '@effect/data/String';
import {
  strict,
} from '@effect/data/typeclass/Equivalence';
import * as Z from '@effect/io/Effect';
import * as LogLevel from '@effect/io/Logger/Level';
import forwardTo from '@userscript/forward-to';
import {
  BroadcastChannel,
} from 'broadcast-channel';
import {
  diff,
} from 'deep-diff';
import deepEq from 'fast-deep-equal';
import {
  Dispatch,
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
  BehaviorSubject,
  Observable,
  concatMap,
  from,
  share,
} from 'rxjs';

import packageJson from '@/../package.json';
import ConfigObservable from '@/ConfigObservable';
import {
  makeSubject,
} from '@/ConfigSubject';
import FlowChat from '@/FlowChat';
import LivePage from '@/LivePage';
import {
  makePageState,
} from '@/LivePageState';
import MainState from '@/MainState';
import SettingState from '@/SettingState';
import UserConfig, {
  makeConfig,
} from '@/UserConfig';
import {
  makeGetter,
} from '@/UserConfigGetter';
import configStream from '@/configStream';
import defaultFilter from '@/defaultFilter';
import defaultGMConfig from '@/defaultGMConfig';
import listeningBroadcastConfigKeys from '@/listeningBroadcastConfigKeys';
import livePageYt from '@/livePageYt';
import logWithMeta from '@/logWithMeta';
import mainCss from '@/mainCss';
import makeChatScreen from '@/makeChatScreen';
import mapObject from '@/mapObject';
import observePair from '@/observePair';
import onChatFieldMutate from '@/onChatFieldMutate';
import onPlayerResize from '@/onPlayerResize';
import removeOldChats from '@/removeOldChats';
import scriptIdentifier from '@/scriptIdentifier';
import setChatPlayState from '@/setChatPlayState';
import setSettingFromConfig from '@/setSettingFromConfig';
import setterFromKeysMap from '@/setterFromKeysMap';
import settingStateInit from '@/settingStateInit';
import settingsComponent from '@/settingsComponent';
import settingsPanelSize from '@/settingsPanelSize';
import simpleWrap from '@/simpleWrap';
import tapEffect from '@/tapEffect';
import toggleChatButton from '@/toggleChatButton';
import toggleSettingsPanelComponent from '@/toggleSettingsPanelComponent';
import updateSettingsRect from '@/updateSettingsRect';
import videoToggleStream from '@/videoToggleStream';

export default ({
  settingUpdateApps,
  provideLog,
}: {
  settingUpdateApps: BehaviorSubject<Dispatch<SettingState>[]>,
  provideLog: (x: Z.Effect<never, never, void>) => Z.Effect<never, never, void>
}): Z.Effect<never, never, unknown> => provideLog(
  pipe(
    defaultGMConfig,
    (x) => ({
      gmConfig: x,
      // eslint-disable-next-line @typescript-eslint/consistent-type-assertions
      configKeys: Object.keys(x) as (keyof UserConfig)[],
    }),
    Z.succeed,
    Z.bindValue('updateSettingState', () => (
      dispatchable: Dispatchable<SettingState>,
    ): Z.Effect<never, never, void> => provideLog(pipe(
      settingUpdateApps.getValue(),
      RA.map((x) => Z.sync(() => x(dispatchable))),
      (x) => Z.all(x),
    ))),
    Z.bind('config', (ctx) => makeConfig(ctx.gmConfig)),
    Z.bindValue('getConfig', (ctx) => makeGetter(ctx.config)),
    flow(
      Z.bindValue('mainState', (x): MainState => ({
        chatPlaying: true,
        playerRect: new DOMRectReadOnly(0, 0, 600, 400),
        config: x.config,
      })),
      Z.bindValue('configSubject', (ctx) => makeSubject(ctx.configKeys)),
      Z.bindValue('setterFromKeysMap', (ctx) => setterFromKeysMap(
        ctx.configKeys,
      )),
      Z.bindValue('setConfigPlain', (ctx) => ctx.setterFromKeysMap(
        (key) => (val) => Z.promise(async () => {
          Object.assign(ctx.mainState.config, {
            [key]: val,
          });

          ctx.configSubject[key].next(val);
        }),
      )),
      Z.bindValue('changedConfigMap', (ctx): (k: keyof UserConfig) => (
      v: never
      ) => Z.Effect<never, O.Option<never>, unknown> => (key) => (val) => pipe(
        Z.promise(async () => ctx.config[key]),
        Z.filterOrFail((x) => !deepEq(x, val), O.none),
        Z.flatMap(() => ctx.setConfigPlain[key](val)),
      )),
      Z.bindValue('setChangedConfig', (ctx) => ctx.setterFromKeysMap(
        ctx.changedConfigMap,
      )),
      Z.bindValue('channel', () => new BroadcastChannel<
      [keyof UserConfig, UserConfig[keyof UserConfig]]
      >(scriptIdentifier)),
    ),
    flow(
      Z.bindValue('setConfig', (ctx) => ctx.setterFromKeysMap(
        (key) => (val) => pipe(
          ctx.changedConfigMap(key)(val),
          Z.zipRight(Z.promise(() => ctx.channel.postMessage([key, val]))),
          Z.zipRight(Z.promise(() => pipe(
            ctx.gmConfig[key],
            (x) => GM.setValue(x.gmKey, x.toGm(val)),
          ))),
        ),
      )),
      Z.bind('reinitSubject', () => Z.sync(() => new Subject<void>())),
      Z.bindValue('reinitialize', (ctx) => provideLog(
        Z.sync(() => {
          requestAnimationFrame(() => forwardTo(ctx.reinitSubject)());
        }),
      )),
      Z.tap((ctx) => ctx.setConfigPlain.filterExp(defaultFilter(ctx.config))),
      Z.bindValue('toggleChatButtonInit', (ctx) => ({
        lang: ctx.config.lang,
        displayChats: ctx.config.displayChats,
      })),
      Z.bind('wrappedToggleChat', (ctx) => simpleWrap(
        toggleChatButton(ctx.setConfig),
        ctx.toggleChatButtonInit,
      )),
      Z.bindValue('flowChats', (): FlowChat[] => []),
      Z.bind('wrappedSettings', (ctx) => simpleWrap(
        settingsComponent({
          setConfig: ctx.setConfig,
          act: {
            clearFlowChats: removeOldChats(ctx.flowChats)(0),
          },
        }),
        settingStateInit(ctx.config),
      )),
      Z.bind('wrappedToggleSettings', (ctx) => simpleWrap(
        toggleSettingsPanelComponent(ctx.updateSettingState),
        settingStateInit(ctx.config),
      )),
    ),
    flow(
      Z.tap((ctx) => Z.sync(() => settingUpdateApps.next([
        ...settingUpdateApps.getValue(),
        ctx.wrappedSettings.dispatch,
        ctx.wrappedToggleSettings.dispatch,
      ]))),
    ),
    Z.bindValue('settingsRectSubject', () => new BehaviorSubject(
      new DOMRectReadOnly(
        0,
        0,
        settingsPanelSize.width,
        settingsPanelSize.height,
      ),
    )),
    Z.tap((ctx) => pipe(
      [
        `Version: ${packageJson.version}`,
        `User Agent: ${window.navigator.userAgent}`,
        `GMConfig: ${JSON.stringify(ctx.config, undefined, 2)}`,
      ],
      RA.map(Z.logDebug),
      (x) => Z.all(x),
    )),
    Z.bindValue('co', (ctx): ConfigObservable => pipe(
      ctx.configSubject,
      mapObject(([k, value]) => [
        k,
        pipe(
          value,
          tapEffect<unknown>((v) => provideLog(pipe(
            v,
            (x) => <T>(s: T) => ({
              ...s,
              [k]: x,
            }),
            Z.succeed,
            Z.tap(() => ctx.updateSettingState(
            // eslint-disable-next-line max-len
            // eslint-disable-next-line @typescript-eslint/consistent-type-assertions, max-len
              setSettingFromConfig(k)(v as UserConfig[keyof UserConfig]),
            )),
            Z.zipLeft(pipe(
              [
                'bannedWords',
                'bannedUsers',
                'bannedWordRegexs',
              ] as const,
              RA.contains(Str.Equivalence)(k),
              (x) => (x ? ctx.setConfig.filterExp(
                defaultFilter(ctx.mainState.config),
              ) : Z.unit()),
            )),
            Z.flatMap((x) => (k in ctx.toggleChatButtonInit
              ? Z.sync(() => ctx.wrappedToggleChat.dispatch(x))
              : Z.unit())),
            (x) => () => Z.runPromise(provideLog(x)),
            (x) => Z.sync(() => requestAnimationFrame(x)),
          ))),
          share(),
        ),
      ]),
    )),
    Z.bindValue('livePage', () => livePageYt),
    Z.bindValue('live', (ctx) => makePageState(ctx.livePage)),
    Z.bind('chatScreen', () => makeChatScreen),
    Z.bind('all$', (ctx) => pipe(
      {
        eq: O.getEquivalence(strict()),
        initDelay: 100,
        urlDelay: 1700,
        changeDetectInterval: 700,
        bodyResizeDetectInterval: 300,
        errorRetryInterval: 5000,
        // eslint-disable-next-line max-len
        // eslint-disable-next-line @typescript-eslint/consistent-type-assertions
        liveElementKeys: Object.keys(ctx.livePage) as (keyof LivePage)[],
        tapUpdateSettingsRect: <T>(
          ob: Observable<T>,
        ) => switchMap((value: T) => pipe(
          ctx.settingsRectSubject,
          first(),
          map(updateSettingsRect(ctx.wrappedToggleSettings.node)(
            (rect) => Z.sync(() => ctx.settingsRectSubject.next(rect)),
          )),
          tapEffect(provideLog),
          map(() => value),
        ))(ob),
        config$: configStream(
          provideLog,
          ctx.mainState,
          ctx.co,
          ctx.chatScreen,
          ctx.flowChats,
          ctx.live,
        ),
      },
      Z.succeed,
      Z.bind('css', () => mainCss),
      Z.bind('documentMutationPair', () => observePair(MutationObserver)),
      Z.bind('chatMutationPair', () => observePair(MutationObserver)),
      Z.bind('playerResizePair', () => observePair(ResizeObserver)),
      Z.bind('bodyResizePair', () => observePair(ResizeObserver)),
      Z.map(
        (c) => pipe(
          ctx.reinitSubject,
          observeOn(asyncScheduler),
          delay(c.initDelay),
          tapEffect(() => provideLog(
            Z.logInfo('Init'),
          )),
          switchMap(() => pipe(
            interval(c.changeDetectInterval),
            c.tapUpdateSettingsRect,
            concatMap((index) => pipe(
              from(Z.runPromise(pipe(
                c.liveElementKeys,
                RA.map((key) => pipe(
                  ctx.live[key],
                  (x): Z.Effect<never, O.Option<never>, Element> => x.read,
                  Z.unsome,
                  Z.map(O.liftPredicate(
                    (newEle) => !c.eq(ctx.live[key].ele, newEle),
                  )),
                  Z.map(O.map(flow(
                    Z.succeed,
                    Z.tap((x) => Z.sync(() => {
                      ctx.live[key].ele = x;
                    })),
                    Z.map(O.isSome),
                    Z.map((x) => `${key} ${x ? 'found' : 'lost'}`),
                    Z.flatMap(Z.logInfo),
                  ))),
                  Z.flatMap(O.match(
                    () => Z.succeed(false),
                    Z.zipRight(Z.succeed(true)),
                  )),
                )),
                (x) => Z.all(x),
                Z.map(RA.some(identity)),
              ))),
              filter(identity),
              map(() => index),
            )),
            startWith(0),
          )),
          tapEffect(() => provideLog(pipe(
            Z.logInfo('Loading...'),
            Z.zipRight(removeOldChats(ctx.flowChats)(0)),
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
                  ctx.live.chatField.ele,
                  O.map((x) => Z.sync(
                    () => c.chatMutationPair.observer.observe(x, {
                      childList: true,
                    }),
                  )),
                ),
                pipe(
                  ctx.live.chatTicker.ele,
                  O.map((x) => Z.sync(
                    () => c.chatMutationPair.observer.observe(x, {
                      childList: true,
                    }),
                  )),
                ),
                pipe(
                  ctx.live.player.ele,
                  O.map(flow(
                    Z.succeed,
                    Z.tap((x) => Z.sync(
                      () => c.playerResizePair.observer.observe(x),
                    )),
                    Z.flatMap((x) => Z.sync(() => x.prepend(ctx.chatScreen))),
                  )),
                ),
                pipe(
                  ctx.live.toggleChatBtnParent.ele,
                  O.map((x) => Z.sync(
                    () => x.prepend(ctx.wrappedToggleChat.node),
                  )),
                ),
                pipe(
                  ctx.live.settingsToggleNextElement.ele,
                  O.map((x) => Z.sync(
                    () => x.before(ctx.wrappedToggleSettings.node),
                  )),
                ),
                pipe(
                  ctx.live.settingsContainer.ele,
                  O.map((x) => Z.sync(
                    () => x.append(ctx.wrappedSettings.node),
                  )),
                ),
                pipe(
                  document.body,
                  O.fromNullable,
                  O.map((x) => Z.sync(
                    () => c.bodyResizePair.observer.observe(x),
                  )),
                ),
              ],
              RA.compact,
              RA.append(pipe(
                ctx.live.video.ele,
                O.filter((x) => !x.paused),
                O.orElse(() => ctx.live.offlineSlate.ele),
                O.isSome,
                (x) => Z.sync(() => {
                  Object.assign(ctx.mainState, {
                    chatPlaying: x,
                  });
                }),
              )),
              (x) => Z.all(x),
            )),
          ))),
          switchMap(() => merge(
            pipe(
              fromEvent(
                ctx.channel,
                'message',
              ),
              map(([key, val]) => pipe(
                listeningBroadcastConfigKeys.includes(key),
                // eslint-disable-next-line max-len
                // eslint-disable-next-line @typescript-eslint/consistent-type-assertions
                (x) => (x ? ctx.setChangedConfig[key](val as never)
                : Z.sync(() => {})),
              )),
              tapEffect(provideLog),
            ),
            ...pipe(
              ctx.configKeys,
              RA.map((key) => pipe(
                // eslint-disable-next-line max-len
                // eslint-disable-next-line @typescript-eslint/consistent-type-assertions
                (ctx.co[key] as Subject<unknown>),
                startWith(ctx.config[key]),
                bufferCount(2, 1),
                map(([x, y]) => diff(x, y)),
                map((x) => Z.logDebug(
                  `Config ${key}: ${JSON.stringify(x, undefined, 2)}`,
                )),
                tapEffect(provideLog),
              )),
            ),
            c.config$,
            pipe(
              ctx.live.video.ele,
              O.match(
                () => EMPTY,
                flow(
                  videoToggleStream,
                  map((playing) => playing
                  || O.isSome(ctx.live.offlineSlate.ele)),
                  map((chatPlaying) => pipe(
                    Z.sync(() => {
                      // eslint-disable-next-line no-param-reassign
                      ctx.mainState.chatPlaying = chatPlaying;
                    }),
                    Z.zipRight(pipe(
                      ctx.flowChats,
                      RA.map(setChatPlayState),
                      RA.map(apply(ctx.mainState)),
                      (x) => Z.all(x),
                    )),
                  )),
                  tapEffect(provideLog),
                ),
              ),
            ),
            pipe(
              c.chatMutationPair.subject,
              map(onChatFieldMutate(
                ctx.chatScreen,
                ctx.flowChats,
                ctx.mainState,
                ctx.getConfig,
                ctx.setConfig,
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
                Z.logInfo(`URL Changed: ${x}`),
                removeOldChats(ctx.flowChats)(0),
                Z.logInfo(`Wait for ${c.urlDelay}ms...`),
              ])),
              tapEffect(provideLog),
              delay(c.urlDelay),
              tapEffect(() => ctx.reinitialize),
            ),
            pipe(
              c.playerResizePair.subject,
              throttleTime(500, undefined, {
                leading: true,
                trailing: true,
              }),
              startWith([]),
              map(() => ctx.live.player.ele),
              map(O.map((x) => x.getBoundingClientRect())),
              tapEffect((x) => provideLog(
                onPlayerResize(x, ctx.flowChats, ctx.mainState),
              )),
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
              ctx.settingsRectSubject,
              tapEffect((panelRect) => ctx.updateSettingState((s) => ({
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
              tapEffect(() => ctx.reinitialize),
            ),
          }),
        ),
      ),
    )),
    Z.tap((ctx) => Z.sync(() => ctx.all$.subscribe({
      error: (x) => Z.runPromise(pipe(
        // eslint-disable-next-line max-len
        // eslint-disable-next-line @typescript-eslint/restrict-template-expressions
        logWithMeta(LogLevel.Error)(`Stream Errored: ${x}`)(x),
      )),
      complete: () => Z.runPromise(Z.logInfo('Stream complete')),
    }))),
    Z.tap((ctx) => ctx.reinitialize),
  ),
);
