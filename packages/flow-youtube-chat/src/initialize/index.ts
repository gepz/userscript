import forwardTo from '@userscript/forward-to';
import wrapApp from '@userscript/ui/wrapApp';
import {
  BroadcastChannel,
} from 'broadcast-channel';
import {
  Array as A,
  Effect as Z,
  Cause,
  Duration as D,
  String as Str,
  LogLevel,
  Schedule,
  pipe,
} from 'effect';
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
import configKeys from '@/configKeys';
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
import tapEffect from '@/tapEffect';
import toggleChatButton from '@/toggleChatButton';
import toggleSettingsPanelComponent from '@/toggleSettingsPanelComponent';

export default ({
  settingUpdateApps,
  provideLog,
}: {
  settingUpdateApps: BehaviorSubject<Dispatch<SettingState>[]>,
  provideLog: <T>(x: Z.Effect<T>) => Z.Effect<T>
}): Z.Effect<unknown> => provideLog(pipe(
  // eslint-disable-next-line func-names
  Z.gen(function* () {
    const ctx = {
      updateSettingState: (
        dispatchable: Dispatchable<SettingState>,
      ): Z.Effect<void> => provideLog(pipe(
        Z.succeed(settingUpdateApps.value),
        Z.flatMap(Z.forEach((x) => Z.sync(() => x(dispatchable)))),
      )),
      configSubject: makeSubject(configKeys),
      setterFromKeysMap: setterFromKeysMap(configKeys),
      channel: new BroadcastChannel<
      [keyof UserConfig, UserConfig[keyof UserConfig]]
      >(scriptIdentifier),
      configValue: yield* makeConfig(defaultGMConfig),
    };

    const setConfigPlain = ctx.setterFromKeysMap(
      (key) => (val) => Z.promise(async () => {
        Object.assign(ctx.configValue, {
          [key]: val,
        });

        ctx.configSubject[key].next(val);
      }),
    );

    yield* setConfigPlain.filterExp(defaultFilter(ctx.configValue));

    const changedConfigMap = (
      key: keyof UserConfig,
    ) => (val: never): Z.Effect<unknown, Cause.NoSuchElementException> => pipe(
      Z.promise(async () => ctx.configValue[key]),
      Z.filterOrFail((x) => !deepEq(x, val)),
      Z.flatMap(() => setConfigPlain[key](val)),
    );

    return {
      ...ctx,
      setChangedConfig: ctx.setterFromKeysMap(
        (key) => (val) => changedConfigMap(key)(val).pipe(Z.ignore),
      ),
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
              Z.zipRight(Z.promise(() => ctx.channel.postMessage([key, val]))),
              Z.zipRight(Z.promise(() => pipe(
                defaultGMConfig[key],
                (x) => GM.setValue(x.gmKey, x.toGm(val)),
              ))),
              Z.ignore,
            ),
          ),
        },
      } satisfies MainState,
    };
  }),
  // eslint-disable-next-line func-names
  Z.flatMap((ctx) => Z.gen(function* () {
    const reinitSubject = new Subject<void>();
    const stateInit = settingStateInit(ctx.mainState.config.value);
    return {
      ...ctx,
      reinitSubject,
      reinitialize: provideLog(Z.sync(() => {
        // eslint-disable-next-line compat/compat
        requestAnimationFrame(() => forwardTo(reinitSubject)());
      })),
      apps: {
        toggleChatButtonApp: yield* wrapApp(
          toggleChatButton(ctx.mainState.config.setConfig),
          stateInit,
        ),
        settingsApp: yield* wrapApp(
          settingsComponent({
            setConfig: ctx.mainState.config.setConfig,
            act: {
              clearFlowChats: removeOldChats(ctx.mainState.flowChats)(0),
            },
            provideLog,
          }),
          stateInit,
        ),
        toggleSettingsPanelApp: yield* wrapApp(
          toggleSettingsPanelComponent(ctx.updateSettingState),
          stateInit,
        ),
      },
    };
  })),
  Z.tap((ctx) => Z.sync(() => settingUpdateApps.next([
    ctx.apps.settingsApp.dispatch,
    ctx.apps.toggleSettingsPanelApp.dispatch,
    ctx.apps.toggleChatButtonApp.dispatch,
  ]))),
  Z.tap((ctx) => pipe(
    Z.succeed([
      `Version: ${packageJson.version}`,
      `User Agent: ${window.navigator.userAgent}`,
      `GMConfig: ${JSON.stringify(ctx.mainState.config, undefined, '\t')}`,
    ]),
    Z.flatMap(Z.forEach((x) => Z.logDebug(x))),
  )),
  Z.zipLeft(pipe(
    Z.logDebug('10s...'),
    Z.schedule(Schedule.fixed(D.seconds(10))),
    Z.forkDaemon,
  )),
  // eslint-disable-next-line func-names
  Z.flatMap((ctx) => Z.gen(function* () {
    return {
      ...ctx,
      live: makePageState(livePageYt),
      chatScreen: yield* makeChatScreen,
      co: pipe(
        ctx.configSubject,
        mapObject(([k, value]) => [
          k,
          pipe(
            value,
            tapEffect<unknown>((v) => provideLog(pipe(
              Z.succeed(<T>(s: T) => ({
                ...s,
                [k]: v,
              })),
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
                A.containsWith(Str.Equivalence)(k),
                (x) => (x ? ctx.mainState.config.setConfig.filterExp(
                  defaultFilter(ctx.mainState.config.value),
                ) : Z.void),
              )),
              (x) => Z.sync(
                () => setTimeout(() => Z.runPromise(provideLog(x)), 0),
              ),
            ))),
            share(),
          ),
        ]),
      ),
    };
  })),
  // eslint-disable-next-line func-names
  Z.flatMap((ctx) => Z.gen(function* () {
    (yield* allStream(
      ctx,
      provideLog,
    )).subscribe({
      error: (x) => Z.runPromise(
        // eslint-disable-next-line max-len
        // eslint-disable-next-line @typescript-eslint/restrict-template-expressions
        logWithMeta(LogLevel.Error)(`Stream Errored: ${x}`)(x),
      ),
      complete: () => Z.runPromise(Z.logWarning('Stream complete')),
    });

    yield* ctx.reinitialize;
  })),
));
