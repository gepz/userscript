import * as D from 'effect/Duration';
import {
  pipe,
} from 'effect/Function';
import * as O from 'effect/Option';
import * as RA from 'effect/ReadonlyArray';
import * as Str from 'effect/String';
import * as Z from 'effect/Effect';
import * as LogLevel from '@effect/io/Logger/Level';
import * as Schedule from 'effect/Schedule';
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
import {
  makeSubject,
} from '@/ConfigSubject';
import FlowChat from '@/FlowChat';
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
import wrapApp from '@/wrapApp';
import tapEffect from '@/tapEffect';
import toggleChatButton from '@/toggleChatButton';
import toggleSettingsPanelComponent from '@/toggleSettingsPanelComponent';
import configKeys from '@/configKeys';

export default ({
  settingUpdateApps,
  provideLog,
}: {
  settingUpdateApps: BehaviorSubject<Dispatch<SettingState>[]>,
  provideLog: <T>(x: Z.Effect<never, never, T>) => Z.Effect<never, never, T>
}): Z.Effect<never, never, unknown> => provideLog(pipe(
  defaultGMConfig,
  (x) => Z.succeed({
    gmConfig: x,
    updateSettingState: (
      dispatchable: Dispatchable<SettingState>,
    ): Z.Effect<never, never, void> => provideLog(pipe(
      settingUpdateApps.value,
      RA.map((x) => Z.sync(() => x(dispatchable))),
      Z.all,
    ))
  }),
  Z.flatMap((ctx) => Z.gen(function* (_) {
    const config = yield* _(makeConfig(ctx.gmConfig));
    return {
      ...ctx,
      configValue: config,
      configSubject:  makeSubject(configKeys),
      setterFromKeysMap: setterFromKeysMap(configKeys),
    }
  })),
  Z.flatMap((ctx) => Z.gen(function* (_) {
    const setConfigPlain = ctx.setterFromKeysMap(
      (key) => (val) => Z.promise(async () => {
        Object.assign(ctx.configValue, {
          [key]: val,
        });
  
        ctx.configSubject[key].next(val);
      }),
    );

    const changedConfigMap = (
      key: keyof UserConfig,
    ) => (val: never): Z.Effect<never, O.Option<never>, unknown> => pipe(
      Z.promise(async () => ctx.configValue[key]),
      Z.filterOrFail((x) => !deepEq(x, val), O.none),
      Z.flatMap(() => setConfigPlain[key](val)),
    );

    yield* _(setConfigPlain.filterExp(defaultFilter(ctx.configValue)));
    
    const channel = new BroadcastChannel<
    [keyof UserConfig, UserConfig[keyof UserConfig]]
    >(scriptIdentifier)

    const {
      configValue,
      ...rest
    } = ctx;

    return {
      ...rest,
      setChangedConfig: ctx.setterFromKeysMap(
        (key) => (val) => changedConfigMap(key)(val).pipe(Z.ignore),
      ),
      channel,
      mainState: {
        chatPlaying: new BehaviorSubject(true),
        playerRect: new BehaviorSubject(new DOMRectReadOnly(0, 0, 600, 400)),
        flowChats: new BehaviorSubject<readonly FlowChat[]>([]),
        config: {
          value: ctx.configValue,
          getConfig: makeGetter(ctx.configValue),
          setConfig: ctx.setterFromKeysMap(
            (key) => (val) => pipe(
              changedConfigMap(key)(val),
              Z.zipRight(Z.promise(() => channel.postMessage([key, val]))),
              Z.zipRight(Z.promise(() => pipe(
                ctx.gmConfig[key],
                (x) => GM.setValue(x.gmKey, x.toGm(val)),
              ))),
              Z.ignore,
            ),
          ),
        }
      } satisfies MainState,
    }
  })),
  Z.flatMap((ctx) => Z.gen(function* (_) {
    const reinitSubject = new Subject<void>();
    const stateInit = settingStateInit(ctx.mainState.config.value);
    return {
      ...ctx,
      reinitSubject,
      reinitialize: provideLog(Z.sync(() => {
        requestAnimationFrame(() => forwardTo(reinitSubject)());
      })),
      apps: {
        toggleChatButtonApp:  yield* _(wrapApp(
          toggleChatButton(ctx.mainState.config.setConfig),
          stateInit,
        )),
        settingsApp: yield* _(wrapApp(
          settingsComponent({
            setConfig: ctx.mainState.config.setConfig,
            act: {
              clearFlowChats: removeOldChats(ctx.mainState.flowChats)(0),
            },
            provideLog,
          }),
          stateInit,
        )),
        toggleSettingsPanelApp: yield* _(wrapApp(
          toggleSettingsPanelComponent(ctx.updateSettingState),
          stateInit,
        )),
      }
    }
  })),
  Z.tap((ctx) => Z.sync(() => settingUpdateApps.next([
    ctx.apps.settingsApp.dispatch,
    ctx.apps.toggleSettingsPanelApp.dispatch,
    ctx.apps.toggleChatButtonApp.dispatch,
  ]))),
  Z.tap((ctx) => pipe(
    [
      `Version: ${packageJson.version}`,
      `User Agent: ${window.navigator.userAgent}`,
      `GMConfig: ${JSON.stringify(ctx.mainState.config, undefined, '\t')}`,
    ],
    RA.map((x) => Z.logDebug(x)),
    Z.all,
  )),
  Z.zipLeft(pipe(
    Z.logDebug('10s...'),
    Z.repeat(Schedule.fixed(D.seconds(10))),
    Z.delay(D.seconds(10)),
    Z.forkDaemon,
  )),
  Z.flatMap((ctx) => Z.gen(function* (_) {
    return {
      ...ctx,
      live: makePageState(livePageYt),
      chatScreen: yield* _(makeChatScreen),
      co: pipe(
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
              Z.zipLeft(ctx.updateSettingState(
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
                (x) => (x ? ctx.mainState.config.setConfig.filterExp(
                  defaultFilter(ctx.mainState.config.value)
                ) : Z.unit),
              )),
              (x) => () => Z.runPromise(provideLog(x)),
              (x) => Z.sync(() => requestAnimationFrame(x)),
            ))),
            share(),
          ),
        ]),
      ),
    }
  })),
  Z.flatMap((ctx) => Z.gen(function* (_) {
    (yield* _(allStream(
      {
        ...ctx,
        // eslint-disable-next-line max-len
        // eslint-disable-next-line @typescript-eslint/consistent-type-assertions
        liveElementKeys: Object.keys(ctx.live) as (keyof typeof ctx.live)[]
      },
      provideLog,
    ))).subscribe({
      error: (x) => Z.runPromise(
        // eslint-disable-next-line max-len
        // eslint-disable-next-line @typescript-eslint/restrict-template-expressions
        logWithMeta(LogLevel.Error)(`Stream Errored: ${x}`)(x),
      ),
      complete: () => Z.runPromise(Z.logWarning('Stream complete')),
    });

    yield* _(ctx.reinitialize);
  })),
));
