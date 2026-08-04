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
  Dispatchable,
} from 'hyperapp';

import packageJson from '@/../package.json';
import {
  emptyAuthorNames,
} from '@/AuthorNameIndex';
import ConfigEntry, {
  makeEntry,
} from '@/ConfigEntry';
import FlowChat from '@/FlowChat';
import MainState from '@/MainState';
import SettingState from '@/SettingState';
import {
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
import laneOverlay from '@/laneOverlay';
import logWithMeta from '@/logWithMeta';
import makeChatScreen from '@/makeChatScreen';
import removeOldChats from '@/removeOldChats';
import scriptIdentifier from '@/scriptIdentifier';
import scrollbarThickness from '@/scrollbarThickness';
import setSettingFromConfig from '@/setSettingFromConfig';
import settingStateInit from '@/settingStateInit';
import settingUpdateApps from '@/settingUpdateApps';
import settingsComponent from '@/settingsComponent';
import settingsPanelSize from '@/settingsPanelSize';
import makeRefs from '@/stream/makeRefs';
import toggleChatButton from '@/toggleChatButton';
import toggleSettingsPanelComponent from '@/toggleSettingsPanelComponent';

export default pipe(
  Z.gen(function* () {
    const updateSettingState = (
      dispatchable: Dispatchable<SettingState>,
    ): Z.Effect<void> => pipe(
      Ref.get(settingUpdateApps),
      Z.flatMap(Z.forEach((x) => Z.sync(() => x(dispatchable)))),
    );

    const channel = new BroadcastChannel<ConfigEntry>(
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
        Z.promise(() => channel.postMessage(makeEntry(key, val))),
        Z.zipRight(Z.promise(() => pipe(
          defaultGMConfig[key],
          (x) => GM.setValue(x.gmKey, x.toGm(val)),
        ))),
      ),
      defaultFilterExp: () => defaultFilter(configValue),
    });

    yield * setConfigPlain.filterExp(defaultFilter(configValue));

    return {
      updateSettingState,
      channel,
      configRefs,
      setChangedConfig,
      mainState: {
        chatPlaying: yield * SynchronizedRef.make(true),
        playerRect: yield * SynchronizedRef.make(
          new DOMRectReadOnly(0, 0, 600, 400),
        ),
        flowChats: yield * SynchronizedRef.make<readonly FlowChat[]>([]),
        authorNames: yield * SynchronizedRef.make(emptyAuthorNames),
        config: {
          value: configValue,
          getConfig: makeGetter(configValue),
          setConfig,
        },
      } satisfies MainState,
    };
  }),
  Z.flatMap((ctx) => Z.gen(function* () {
    const panelSize = settingsPanelSize(yield * scrollbarThickness);
    const stateInit = settingStateInit(panelSize)(ctx.mainState.config.value);
    const chatScreen = yield * makeChatScreen;
    return {
      ...ctx,
      panelSize,
      chatScreen,
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
            laneOverlay: laneOverlay(chatScreen, ctx.mainState.config.value),
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
  Z.tap((ctx) => Z.forEach([
    `Version: ${packageJson.version}`,
    `User Agent: ${window.navigator.userAgent}`,
    `Config: ${JSON.stringify(ctx.mainState.config.value, undefined, '\t')}`,
  ], (x) => Z.logDebug(x))),
  Z.zipLeft(pipe(
    Z.logDebug('10s...'),
    Z.schedule(Schedule.fixed(D.seconds(10))),
    Z.forkDaemon,
  )),
  Z.flatMap((ctx) => Z.gen(function* () {
    const reinitQueue = yield * Queue.unbounded<void>();
    const reinitialize = Z.sync(() => {
      requestAnimationFrame(() => {
        Queue.unsafeOffer(reinitQueue, undefined);
      });
    });

    const stream = yield * allStream({
      ...ctx,
      reinitQueue,
      reinitialize,
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
) satisfies Z.Effect<unknown>;
