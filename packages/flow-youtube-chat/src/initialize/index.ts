import {
  seconds,
} from '@effect/data/Duration';
import {
  pipe,
  flow,
} from '@effect/data/Function';
import * as O from '@effect/data/Option';
import * as RA from '@effect/data/ReadonlyArray';
import * as Str from '@effect/data/String';
import * as Z from '@effect/io/Effect';
import * as LogLevel from '@effect/io/Logger/Level';
import * as Schedule from '@effect/io/Schedule';
import forwardTo from '@userscript/forward-to';
import {
  BroadcastChannel,
} from 'broadcast-channel';
import deepEq from 'fast-deep-equal';
import {
  Dispatch,
  Dispatchable,
} from 'hyperapp';
import {
  Subject,
  BehaviorSubject,
  share,
} from 'rxjs';

import packageJson from '@/../package.json';
import ConfigObservable from '@/ConfigObservable';
import {
  makeSubject,
} from '@/ConfigSubject';
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
import allStream from '@/allStream';
import defaultFilter from '@/defaultFilter';
import defaultGMConfig from '@/defaultGMConfig';
import livePageYt from '@/livePageYt';
import logWithMeta from '@/logWithMeta';
import makeChatScreen from '@/makeChatScreen';
import mapObject from '@/mapObject';
import removeOldChats from '@/removeOldChats';
import scriptIdentifier from '@/scriptIdentifier';
import setSettingFromConfig from '@/setSettingFromConfig';
import setterFromKeysMap from '@/setterFromKeysMap';
import settingStateInit from '@/settingStateInit';
import settingsComponent from '@/settingsComponent';
import settingsPanelSize from '@/settingsPanelSize';
import simpleWrap from '@/simpleWrap';
import tapEffect from '@/tapEffect';
import toggleChatButton from '@/toggleChatButton';
import toggleSettingsPanelComponent from '@/toggleSettingsPanelComponent';

export default ({
  settingUpdateApps,
  provideLog,
}: {
  settingUpdateApps: BehaviorSubject<Dispatch<SettingState>[]>,
  provideLog: <T>(x: Z.Effect<never, never, T>) => Z.Effect<never, never, T>
}): Z.Effect<never, never, unknown> => provideLog(pipe(
  defaultGMConfig,
  (x) => ({
    gmConfig: x,
    // eslint-disable-next-line @typescript-eslint/consistent-type-assertions
    configKeys: Object.keys(x) as (keyof UserConfig)[],
  }),
  Z.succeed,
  Z.letDiscard('updateSettingState', (
    dispatchable: Dispatchable<SettingState>,
  ): Z.Effect<never, never, void> => provideLog(pipe(
    settingUpdateApps.getValue(),
    RA.map((x) => Z.sync(() => x(dispatchable))),
    Z.all,
  ))),
  Z.bind('config', (ctx) => makeConfig(ctx.gmConfig)),
  Z.let('getConfig', (ctx) => makeGetter(ctx.config)),
  flow(
    Z.let('mainState', (x): MainState => ({
      chatPlaying: true,
      playerRect: new DOMRectReadOnly(0, 0, 600, 400),
      config: x.config,
      flowChats: [],
    })),
    Z.let('configSubject', (ctx) => makeSubject(ctx.configKeys)),
    Z.let('setterFromKeysMap', (ctx) => setterFromKeysMap(ctx.configKeys)),
    Z.let('setConfigPlain', (ctx) => ctx.setterFromKeysMap(
      (key) => (val) => Z.promise(async () => {
        Object.assign(ctx.mainState.config, {
          [key]: val,
        });

        ctx.configSubject[key].next(val);
      }),
    )),
    Z.let('changedConfigMap', (ctx) => (
      key: keyof UserConfig,
    ) => (val: never): Z.Effect<never, O.Option<never>, unknown> => pipe(
      Z.promise(async () => ctx.config[key]),
      Z.filterOrFail((x) => !deepEq(x, val), O.none),
      Z.flatMap(() => ctx.setConfigPlain[key](val)),
    )),
    Z.let('setChangedConfig', (ctx) => ctx.setterFromKeysMap(
      (key) => (val) => pipe(
        ctx.changedConfigMap(key)(val),
        Z.ignore,
      ),
    )),
    Z.letDiscard('channel', new BroadcastChannel<
    [keyof UserConfig, UserConfig[keyof UserConfig]]
    >(scriptIdentifier)),
  ),
  flow(
    Z.let('setConfig', (ctx) => ctx.setterFromKeysMap(
      (key) => (val) => pipe(
        ctx.changedConfigMap(key)(val),
        Z.zipRight(Z.promise(() => ctx.channel.postMessage([key, val]))),
        Z.zipRight(Z.promise(() => pipe(
          ctx.gmConfig[key],
          (x) => GM.setValue(x.gmKey, x.toGm(val)),
        ))),
        Z.ignore,
      ),
    )),
    Z.bindDiscard('reinitSubject', Z.sync(() => new Subject<void>())),
    Z.let('reinitialize', (ctx) => provideLog(Z.sync(() => {
      requestAnimationFrame(() => forwardTo(ctx.reinitSubject)());
    }))),
    Z.tap((ctx) => ctx.setConfigPlain.filterExp(defaultFilter(ctx.config))),
    Z.let('toggleChatButtonInit', (ctx) => ({
      lang: ctx.config.lang,
      displayChats: ctx.config.displayChats,
    })),
    Z.bind('wrappedToggleChat', (ctx) => simpleWrap(
      toggleChatButton(ctx.setConfig),
      ctx.toggleChatButtonInit,
    )),
    Z.bind('wrappedSettings', (ctx) => simpleWrap(
      settingsComponent({
        setConfig: ctx.setConfig,
        act: {
          clearFlowChats: removeOldChats(ctx.mainState)(0),
        },
        provideLog,
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
      ctx.wrappedSettings.dispatch,
      ctx.wrappedToggleSettings.dispatch,
    ]))),
    Z.letDiscard('settingsRectSubject', new BehaviorSubject(
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
        `GMConfig: ${JSON.stringify(ctx.config, undefined, '\t')}`,
      ],
      RA.map(Z.logDebug),
      Z.all,
    )),
    Z.zipLeft(pipe(
      Z.logDebug('10s...'),
      Z.repeat(Schedule.fixed(seconds(10))),
      Z.delay(seconds(10)),
      Z.forkDaemon,
    )),
  ),
  Z.let('co', (ctx): ConfigObservable => pipe(
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
              'bannedWordRegexes',
            ] as const,
            RA.contains(Str.Equivalence)(k),
            (x) => (x ? ctx.setConfig.filterExp(
              defaultFilter(ctx.config),
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
  Z.letDiscard('livePage', livePageYt),
  Z.let('live', (ctx) => makePageState(ctx.livePage)),
  Z.bindDiscard('chatScreen', makeChatScreen),
  Z.bind('all$', (ctx) => allStream(ctx, provideLog)),
  Z.tap((ctx) => Z.sync(() => ctx.all$.subscribe({
    error: (x) => Z.runPromise(
      // eslint-disable-next-line max-len
      // eslint-disable-next-line @typescript-eslint/restrict-template-expressions
      logWithMeta(LogLevel.Error)(`Stream Errored: ${x}`)(x),
    ),
    complete: () => Z.runPromise(Z.logWarning('Stream complete')),
  }))),
  Z.tap((ctx) => ctx.reinitialize),
));
