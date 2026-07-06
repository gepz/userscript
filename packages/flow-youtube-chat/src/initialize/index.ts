import wrapApp from '@userscript/ui/wrapApp';
import {
  BroadcastChannel,
} from 'broadcast-channel';
import {
  SynchronizedRef,
  Array as A,
  Cause,
  Effect as Z,
  Duration as D,
  Queue,
  Ref,
  LogLevel,
  Schedule,
  Stream,
  pipe,
} from 'effect';
import {
  Dispatch,
  Dispatchable,
} from 'hyperapp';

import packageJson from '@/../package.json';
import FlowChat from '@/FlowChat';
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
import configWriteFunnel from '@/configWriteFunnel';
import defaultFilter from '@/defaultFilter';
import defaultGMConfig from '@/defaultGMConfig';
import logWithMeta from '@/logWithMeta';
import makeChatScreen from '@/makeChatScreen';
import removeOldChats from '@/removeOldChats';
import scriptIdentifier from '@/scriptIdentifier';
import setSettingFromConfig from '@/setSettingFromConfig';
import settingStateInit from '@/settingStateInit';
import settingsComponent from '@/settingsComponent';
import makeRefs from '@/stream/makeRefs';
import toggleChatButton from '@/toggleChatButton';
import toggleSettingsPanelComponent from '@/toggleSettingsPanelComponent';

export default ({
  settingUpdateApps,
  provideLog,
}: {
  settingUpdateApps: Ref.Ref<Dispatch<SettingState>[]>
  provideLog: <T>(x: Z.Effect<T>) => Z.Effect<T>
}): Z.Effect<unknown> => provideLog(pipe(
  // eslint-disable-next-line func-names
  Z.gen(function* () {
    const updateSettingState = (
      dispatchable: Dispatchable<SettingState>,
    ): Z.Effect<void> => provideLog(pipe(
      Ref.get(settingUpdateApps),
      Z.flatMap(Z.forEach((x) => Z.sync(() => x(dispatchable)))),
    ));

    const channel = new BroadcastChannel<
      { [K in keyof UserConfig]: [K, UserConfig[K]] }[keyof UserConfig]>(
      scriptIdentifier,
    );

    const configValue = yield * makeConfig(defaultGMConfig);
    const configRefs = yield * makeRefs(configValue);

    const {
      setConfigPlain,
      setChangedConfig,
      setConfig,
    } = configWriteFunnel({
      configValue,
      configRefs,
      configKeys,
      dispatchToSettings: (key) => (val) => updateSettingState(
        setSettingFromConfig(key)(val),
      ),
      broadcastAndPersist: (key) => (val) => pipe(
        Z.promise(() => channel.postMessage(
          // eslint-disable-next-line @typescript-eslint/consistent-type-assertions
          [key, val] as {
            [K2 in keyof UserConfig]: [K2, UserConfig[K2]]
          }[keyof UserConfig],
        )),
        Z.zipRight(Z.promise(() => pipe(
          defaultGMConfig[key],
          // eslint-disable-next-line @typescript-eslint/consistent-type-assertions
          (x) => GM.setValue(x.gmKey, x.toGm(val as never)),
        ))),
      ),
      defaultFilterExp: () => defaultFilter(configValue),
    });

    yield * setConfigPlain.filterExp(defaultFilter(configValue));

    return {
      updateSettingState,
      channel,
      configValue,
      configRefs,
      setChangedConfig,
      mainState: {
        chatPlaying: yield * SynchronizedRef.make(true),
        playerRect: yield * SynchronizedRef.make(
          new DOMRectReadOnly(0, 0, 600, 400),
        ),
        flowChats: yield * SynchronizedRef.make<readonly FlowChat[]>([]),
        config: {
          value: configValue,
          getConfig: makeGetter(configValue),
          setConfig,
        },
      } satisfies MainState,
    };
  }),
  // eslint-disable-next-line func-names
  Z.flatMap((ctx) => Z.gen(function* () {
    const stateInit = settingStateInit(ctx.mainState.config.value);
    return {
      ...ctx,
      apps: {
        toggleChatButtonApp: yield * wrapApp(
          toggleChatButton(ctx.mainState.config.setConfig),
          stateInit,
        ),
        settingsApp: yield * wrapApp(
          settingsComponent({
            setConfig: ctx.mainState.config.setConfig,
            act: {
              clearFlowChats: removeOldChats(ctx.mainState.flowChats)(0),
            },
            provideLog,
          }),
          stateInit,
        ),
        toggleSettingsPanelApp: yield * wrapApp(
          toggleSettingsPanelComponent(ctx.updateSettingState),
          stateInit,
        ),
      },
    };
  })),
  Z.tap((ctx) => Ref.set(settingUpdateApps, A.map([
    ctx.apps.settingsApp,
    ctx.apps.toggleSettingsPanelApp,
    ctx.apps.toggleChatButtonApp,
  ], (x) => x.dispatch))),
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
    const reinitQueue = yield * Queue.unbounded<void>();
    const reinitialize = provideLog(Z.sync(() => {
      requestAnimationFrame(() => {
        Queue.unsafeOffer(reinitQueue, undefined);
      });
    }));

    const stream = yield * allStream(
      provideLog,
    )({
      ...ctx,
      reinitQueue,
      reinitialize,
      chatScreen: yield * makeChatScreen,
    });

    yield * pipe(
      Stream.runDrain(stream),
      Z.zipRight(Z.logWarning('Stream complete')),
      Z.catchAllCause((cause) => logWithMeta(LogLevel.Error)(
        `Stream Errored: ${Cause.pretty(cause)}`,
      )(Cause.squash(cause))),
      Z.forkDaemon,
    );

    yield * reinitialize;
  })),
));
