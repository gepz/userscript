import {
  seconds,
} from '@effect/data/Duration';
import {
  pipe,
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
  Z.let('updateSettingState', () => (
    dispatchable: Dispatchable<SettingState>,
  ): Z.Effect<never, never, void> => provideLog(pipe(
    settingUpdateApps.value,
    RA.map((x) => Z.sync(() => x(dispatchable))),
    Z.all,
  ))),
  Z.bind('config', (ctx) => makeConfig(ctx.gmConfig)),
  (context) => context.pipe(
    Z.let('getConfig', (ctx) => makeGetter(ctx.config)),
    Z.let('mainState', (x): MainState => ({
      chatPlaying: new BehaviorSubject(true),
      playerRect: new BehaviorSubject(new DOMRectReadOnly(0, 0, 600, 400)),
      config: x.config,
      flowChats: new BehaviorSubject<readonly FlowChat[]>([]),
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
    Z.let('channel', () => new BroadcastChannel<
    [keyof UserConfig, UserConfig[keyof UserConfig]]
    >(scriptIdentifier)),
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
    Z.bind('reinitSubject', () => Z.sync(() => new Subject<void>())),
    Z.let('reinitialize', (ctx) => provideLog(Z.sync(() => {
      requestAnimationFrame(() => forwardTo(ctx.reinitSubject)());
    }))),
    Z.tap((ctx) => ctx.setConfigPlain.filterExp(defaultFilter(ctx.config))),
    Z.let('stateInit', (ctx) => settingStateInit(ctx.config)),
    Z.bind('wrappedToggleChat', (ctx) => simpleWrap(
      toggleChatButton(ctx.setConfig),
      ctx.stateInit,
    )),
    Z.bind('wrappedSettings', (ctx) => simpleWrap(
      settingsComponent({
        setConfig: ctx.setConfig,
        act: {
          clearFlowChats: removeOldChats(ctx.mainState.flowChats)(0),
        },
        provideLog,
      }),
      ctx.stateInit,
    )),
    Z.bind('wrappedToggleSettings', (ctx) => simpleWrap(
      toggleSettingsPanelComponent(ctx.updateSettingState),
      ctx.stateInit,
    )),
  ),
  (context) => context.pipe(
    Z.tap((ctx) => Z.sync(() => settingUpdateApps.next([
      ctx.wrappedSettings.dispatch,
      ctx.wrappedToggleSettings.dispatch,
      ctx.wrappedToggleChat.dispatch,
    ]))),
    Z.tap((ctx) => pipe(
      [
        `Version: ${packageJson.version}`,
        `User Agent: ${window.navigator.userAgent}`,
        `GMConfig: ${JSON.stringify(ctx.config, undefined, '\t')}`,
      ],
      RA.map((x) => Z.logDebug(x)),
      Z.all,
    )),
    Z.zipLeft(pipe(
      Z.logDebug('10s...'),
      Z.repeat(Schedule.fixed(seconds(10))),
      Z.delay(seconds(10)),
      Z.forkDaemon,
    )),
  ),
  Z.let('live', () => makePageState(livePageYt)),
  Z.bind('chatScreen', () => makeChatScreen),
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
            // eslint-disable-next-line @typescript-eslint/consistent-type-assertions
            setSettingFromConfig(k)(v as UserConfig[keyof UserConfig]),
          )),
          Z.zipLeft(pipe(
            [
              'bannedWords',
              'bannedUsers',
              'bannedWordRegexes',
            ] as const,
            RA.containsWith(Str.Equivalence)(k),
            (x) => (x ? ctx.setConfig.filterExp(defaultFilter(ctx.config))
            : Z.unit),
          )),
          (x) => () => Z.runPromise(provideLog(x)),
          (x) => Z.sync(() => requestAnimationFrame(x)),
        ))),
        share(),
      ),
    ]),
  )),
  // eslint-disable-next-line @typescript-eslint/consistent-type-assertions
  Z.let('liveElementKeys', (ctx) => Object.keys(
    ctx.live,
  ) as (keyof LivePage)[]),
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
