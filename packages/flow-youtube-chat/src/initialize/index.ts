import forwardTo from '@userscript/forward-to';
import {
  BroadcastChannel,
} from 'broadcast-channel';
import {
  diff,
} from 'deep-diff';
import deepEq from 'fast-deep-equal';
import {
  eqStrict,
} from 'fp-ts/Eq';
import * as IO from 'fp-ts/IO';
import * as O from 'fp-ts/Option';
import * as R from 'fp-ts/Reader';
import * as RA from 'fp-ts/ReadonlyArray';
import * as T from 'fp-ts/Task';
import * as TO from 'fp-ts/TaskOption';
import {
  pipe,
  apply,
  flow,
} from 'fp-ts/function';
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
  tap,
  delay,
  switchMap,
  startWith,
  observeOn,
  retry,
  throttleTime,
  distinctUntilChanged,
  skip,
  bufferCount,
  defer,
  of,
  BehaviorSubject,
  Observable,
} from 'rxjs';

import packageJson from '@/../package.json';
import ChatUpdateConfig from '@/ChatUpdateConfig';
import ConfigSubject, {
  makeSubject,
} from '@/ConfigSubject';
import FlowChat from '@/FlowChat';
import LivePage from '@/LivePage';
import LivePageState, {
  makePageState,
} from '@/LivePageState';
import Logger from '@/Logger';
import MainState from '@/MainState';
import SettingState from '@/SettingState';
import UserConfig from '@/UserConfig';
import UserConfigGetter, {
  makeGetter,
} from '@/UserConfigGetter';
import UserConfigSetter from '@/UserConfigSetter';
import appendLog from '@/appendLog';
import consoleLog from '@/consoleLog';
import createChatScreen from '@/createChatScreen';
import defaultFilter from '@/defaultFilter';
import defaultUserConfig from '@/defaultUserConfig';
import livePageYt from '@/livePageYt';
import mainCss from '@/mainCss';
import observePair from '@/observePair';
import onChatFieldMutate from '@/onChatFieldMutate';
import onPlayerResize from '@/onPlayerResize';
import removeOldChats from '@/removeOldChats';
import renderChat from '@/renderChat';
import scaleChatField from '@/scaleChatField';
import scriptIdentifier from '@/scriptIdentifier';
import setChatAnimation from '@/setChatAnimation';
import setChatAppCss from '@/setChatAppCss';
import setChatPlayState from '@/setChatPlayState';
import setSettingFromConfig from '@/setSettingFromConfig';
import settingStateInit from '@/settingStateInit';
import settingsComponent from '@/settingsComponent';
import settingsPanelSize from '@/settingsPanelSize';
import simpleWrap from '@/simpleWrap';
import toggleChatButton from '@/toggleChatButton';
import toggleSettingsPanelComponent from '@/toggleSettingsPanelComponent';
import updateSettingsRect from '@/updateSettingsRect';
import videoToggleStream from '@/videoToggleStream';

export default (): Promise<unknown> => pipe(
  defaultUserConfig,
  flow(
    T.map((x) => ({
      userConfig: x,
      // eslint-disable-next-line @typescript-eslint/consistent-type-assertions
      configKeys: Object.keys(x) as (keyof UserConfig)[],
      getConfig: makeGetter(x),
    })),
    T.let('mainState', (x): MainState => ({
      chatPlaying: true,
      playerRect: new DOMRectReadOnly(0, 0, 600, 400),
      getConfig: x.getConfig,
    })),
    T.let('configSubject', (ctx): ConfigSubject => makeSubject(ctx.configKeys)),
    T.let('setterFromKeyMap', (ctx) => (
      f: R.Reader<keyof UserConfig, R.Reader<never, T.Task<unknown>>>,
    ): UserConfigSetter => pipe(
      ctx.configKeys,
      RA.map((x) => [x, f(x)]),
      Object.fromEntries,
    )),
    T.let('setConfigPlain', (ctx) => ctx.setterFromKeyMap(
      (key) => (val) => async () => {
        ctx.userConfig[key].val = val;
        ctx.configSubject[key].next(val);
      },
    )),
    T.let('setChangedConfig', (ctx) => ctx.setterFromKeyMap(
      (key) => (val) => pipe(
        async () => ctx.getConfig[key](),
        T.map(O.fromPredicate((x) => !deepEq(x, val))),
        TO.chainTaskK(() => ctx.setConfigPlain[key](val)),
      ),
    )),
    T.apS('channel', T.of(new BroadcastChannel<
    [keyof UserConfig, UserConfig[keyof UserConfig]['val']]
    >(scriptIdentifier))),
    T.let('setAndBroadcastChangedConfig', (ctx) => ctx.setterFromKeyMap(
      (key) => (val) => pipe(
        async () => ctx.getConfig[key](),
        T.map(O.fromPredicate((x) => !deepEq(x, val))),
        TO.chainTaskK(() => ctx.setConfigPlain[key](val)),
        TO.chainTaskK(() => async () => {
          ctx.channel.postMessage([key, val]);
          const item = ctx.userConfig[key];
          GM.setValue(item.gmKey, item.toGm(val));
        }),
      ),
    )),
  ),
  flow(
    T.apS('reinitSubject', T.fromIO(() => new Subject<void>())),
    T.let('reinitialize', (ctx) => () => {
      requestAnimationFrame(() => forwardTo(ctx.reinitSubject)());
    }),
    T.let('toggleChatButtonInit', (ctx) => ({
      lang: ctx.getConfig.lang(),
      displayChats: ctx.getConfig.displayChats(),
    })),
    T.let('wrappedToggleChat', (ctx) => simpleWrap(
      toggleChatButton(ctx.setAndBroadcastChangedConfig),
      ctx.toggleChatButtonInit,
    )()),
    T.apS('flowChats', T.of<FlowChat[]>([])),
    T.apS('settingUpdateApps', T.of<Dispatch<SettingState>[]>([])),
    T.let('updateSettingState', (ctx) => (
      dispatchable: Dispatchable<SettingState>,
    ) => pipe(
      ctx.settingUpdateApps,
      RA.map((x) => () => x(dispatchable)),
      IO.sequenceArray,
    )),
    T.let('wrappedSettings', (ctx) => simpleWrap(
      settingsComponent({
        setConfig: ctx.setAndBroadcastChangedConfig,
        act: {
          clearFlowChats: T.fromIO(removeOldChats(ctx.flowChats)(0)),
        },
      }),
      settingStateInit(ctx.getConfig),
    )()),
    T.let('wrappedToggleSettings', (ctx) => simpleWrap(
      toggleSettingsPanelComponent(ctx.updateSettingState),
      settingStateInit(ctx.getConfig),
    )()),
  ),
  flow(
    T.chainFirstIOK((ctx) => () => ctx.settingUpdateApps.push(
      ctx.wrappedSettings.dispatch,
      ctx.wrappedToggleSettings.dispatch,
    )),
    T.apS('settingsRectSubject', T.of(new BehaviorSubject(new DOMRectReadOnly(
      0,
      0,
      settingsPanelSize.width,
      settingsPanelSize.height,
    )))),
    T.let('settingLog', (ctx): Logger => (
      x,
    ) => ctx.updateSettingState((s) => ({
      ...s,
      eventLog: appendLog(s.eventLog)(x),
    }))),
    T.let('mixLog', (ctx): Logger => pipe(
      [
        ctx.settingLog,
        consoleLog,
      ],
      R.sequenceArray,
      R.map(IO.sequenceArray),
    )),
  ),
  T.chainFirstIOK((ctx) => pipe(
    [
      ['Version', packageJson.version],
      ['User Agent', window.navigator.userAgent],
      ['UserConfig', JSON.stringify(ctx.userConfig)],
    ],
    RA.map(ctx.settingLog),
    IO.sequenceArray,
  )),
  T.let('cs', (ctx): ConfigSubject => pipe(
    ctx.configSubject,
    // eslint-disable-next-line @typescript-eslint/consistent-type-assertions
    (x) => Object.entries(x) as {
      [K in keyof ConfigSubject]: [K, ConfigSubject[K]];
    }[keyof ConfigSubject][],
    RA.map(([k, value]) => [
      k,
      pipe(
        value,
        tap<unknown>((v) => pipe(
          v,
          (x) => <T>(s: T) => ({
            ...s,
            [k]: x,
          }),
          IO.of,
          IO.chainFirst(() => ctx.updateSettingState(
            // eslint-disable-next-line max-len
            // eslint-disable-next-line @typescript-eslint/consistent-type-assertions, max-len
            setSettingFromConfig(k)(v as UserConfig[keyof UserConfigGetter]['val']),
          )),
          IO.chain((x) => (k in ctx.toggleChatButtonInit
            ? () => ctx.wrappedToggleChat.dispatch(x)
            : () => {})),
          (x) => () => requestAnimationFrame(x),
        )()),
      ),
    ]),
    Object.fromEntries,
  )),
  T.apS('livePage', T.of(livePageYt)),
  T.let('live', (ctx): LivePageState => makePageState(ctx.livePage)),
  T.apS('chatScreen', T.fromIO(createChatScreen)),
  T.let('config$', (ctx) => pipe(
    ctx.cs,
    (cs) => defer(() => merge(
      merge(
        cs.bannedWordRegexs,
        cs.bannedWords,
        cs.bannedUsers,
      ),
      pipe(
        cs.fieldScale,
        startWith(ctx.getConfig.fieldScale()),
        map(scaleChatField(ctx.live)),
        tap((x) => x()),
      ),
      pipe(
        merge(
          pipe(
            merge(
              cs.font,
              cs.fontSize,
              cs.fontWeight,
              cs.laneCount,
              cs.minSpacing,
              cs.flowY1,
              cs.flowY2,
              pipe(
                cs.flowX1,
                startWith(ctx.getConfig.flowX1()),
                tap((x) => Object.assign<
                CSSStyleDeclaration,
                Partial<CSSStyleDeclaration>
                >(ctx.chatScreen.style, {
                  left: `${x * 100}%`,
                  width: `${(ctx.getConfig.flowX2() - x) * 100}%`,
                })),
              ),
              pipe(
                cs.flowX2,
                tap((x) => Object.assign<
                CSSStyleDeclaration,
                Partial<CSSStyleDeclaration>
                >(ctx.chatScreen.style, {
                  left: `${ctx.getConfig.flowX1() * 100}%`,
                  width: `${(x - ctx.getConfig.flowX1()) * 100}%`,
                })),
              ),
              cs.textOnly,
            ),
            map(() => ({
              render: true,
              setAnimation: true,
            })),
          ),
          pipe(
            merge(
              cs.color,
              cs.ownerColor,
              cs.moderatorColor,
              cs.memberColor,
              cs.shadowColor,
              cs.chatOpacity,
              cs.shadowFontWeight,
              cs.displayChats,
            ),
            map(() => ({
              render: true,
            })),
          ),
          pipe(
            cs.flowSpeed,
            map(() => ({
              setPlayState: true,
            })),
          ),
          pipe(
            merge(
              pipe(
                cs.maxChatCount,
                map(removeOldChats(ctx.flowChats)),
                tap((x) => x()),
              ),
              cs.noOverlap,
              cs.timingFunction,
            ),
            map(() => ({
              setAnimation: true,
            })),
          ),
        ),
        throttleTime(180, undefined, {
          leading: true,
          trailing: true,
        }),
        tap((config: Partial<ChatUpdateConfig>) => pipe(
          ctx.flowChats,
          RA.filter((x) => !x.animationEnded),
          RA.map((chat) => pipe(
            {
              render: false,
              setAnimation: false,
              setPlayState: false,
              ...config,
            } satisfies ChatUpdateConfig,
            (x: ChatUpdateConfig) => pipe(
              [
                pipe(
                  renderChat(chat),
                  O.fromPredicate(() => x.render),
                ),
                pipe(
                  setChatAnimation(chat, ctx.flowChats),
                  O.fromPredicate(() => x.setAnimation),
                  O.alt(() => pipe(
                    setChatPlayState(chat),
                    O.fromPredicate(() => x.setPlayState),
                  )),
                ),
              ],
              RA.compact,
              RA.map(apply(ctx.mainState)),
              IO.sequenceArray,
            ),
          )),
          IO.sequenceArray,
        )()),
      ),
      pipe(
        cs.lang,
        tap((lang) => ctx.updateSettingState((x) => ({
          ...x,
          lang,
        }))()),
      ),
      cs.maxChatLength,
      cs.simplifyChatField,
      cs.createBanButton,
      cs.createChats,
      cs.displayModName,
      cs.displaySuperChatAuthor,
      cs.fieldScale,
      pipe(
        merge(
          cs.bannedWords,
          cs.bannedWordRegexs,
          cs.bannedUsers,
        ),
        tap(() => ctx.setAndBroadcastChangedConfig.filterExp(
          defaultFilter(ctx.getConfig),
        )()),
      ),
    )),
  )),
  T.bind('all$', (ctx) => pipe(
    {
      eq: O.getEq(eqStrict).equals,
      initDelay: 100,
      urlDelay: 1700,
      changeDetectInterval: 700,
      bodyResizeDetectInterval: 300,
      errorRetryInterval: 5000,
      // eslint-disable-next-line @typescript-eslint/consistent-type-assertions
      liveElementKeys: Object.keys(ctx.livePage) as (keyof LivePage)[],
      tapUpdateSettingsRect: <T>(
        ob: Observable<T>,
      ) => switchMap((value: T) => pipe(
        ctx.settingsRectSubject,
        first(),
        map(updateSettingsRect(ctx.wrappedToggleSettings.node)(
          (rect) => () => ctx.settingsRectSubject.next(rect),
        )),
        tap((x) => x()),
        map(() => value),
      ))(ob),
    },
    IO.of,
    IO.apS('css', mainCss),
    IO.apS('documentMutationPair', observePair(MutationObserver)),
    IO.apS('chatMutationPair', observePair(MutationObserver)),
    IO.apS('playerResizePair', observePair(ResizeObserver)),
    IO.apS('bodyResizePair', observePair(ResizeObserver)),
    IO.map((c) => pipe(
      ctx.reinitSubject,
      observeOn(asyncScheduler),
      delay(c.initDelay),
      tap(ctx.mixLog(['Init'])),
      switchMap(() => pipe(
        interval(c.changeDetectInterval),
        c.tapUpdateSettingsRect,
        filter(() => pipe(
          c.liveElementKeys,
          RA.map((key) => pipe(
            ctx.live[key].read(),
            O.fromPredicate((newEle) => !c.eq(ctx.live[key].ele, newEle)),
            O.map(flow(
              IO.of,
              IO.chainFirst((x) => () => {
                ctx.live[key].ele = x;
              }),
              IO.map(O.isSome),
              IO.map((x) => `${key} ${x ? 'found' : 'lost'}`),
              IO.chain((x) => ctx.mixLog([x])),
            )),
          )),
          RA.compact,
          IO.sequenceArray,
          IO.map(RA.isNonEmpty),
        )()),
        startWith(0),
      )),
      tap(ctx.mixLog(['Loading...'])),
      tap(() => {
        removeOldChats(ctx.flowChats)(0)();
        c.documentMutationPair.observer.disconnect();
        c.documentMutationPair.observer.observe(document, {
          childList: true,
          subtree: true,
        });

        c.chatMutationPair.observer.disconnect();
        c.playerResizePair.observer.disconnect();
        c.bodyResizePair.observer.disconnect();
        document.head.append(c.css);
        pipe(
          [
            pipe(
              ctx.live.chatField.ele,
              O.map(flow(
                IO.of,
                IO.chainFirst(setChatAppCss),
                IO.chain((x) => () => c.chatMutationPair.observer.observe(x, {
                  childList: true,
                })),
              )),
            ),
            pipe(
              ctx.live.chatTicker.ele,
              O.map((x) => () => c.chatMutationPair.observer.observe(x, {
                childList: true,
              })),
            ),
            pipe(
              ctx.live.player.ele,
              O.map(flow(
                IO.of,
                IO.chainFirst(
                  (x) => () => c.playerResizePair.observer.observe(x),
                ),
                IO.chain((x) => () => x.prepend(ctx.chatScreen)),
              )),
            ),
            pipe(
              ctx.live.toggleChatBtnParent.ele,
              O.map((x) => () => x.append(ctx.wrappedToggleChat.node)),
            ),
            pipe(
              ctx.live.settingsToggleNextElement.ele,
              O.map((x) => () => x.before(ctx.wrappedToggleSettings.node)),
            ),
            pipe(
              ctx.live.settingsContainer.ele,
              O.map(flow(
                IO.of,
                IO.chainFirst((x) => () => x.append(ctx.wrappedSettings.node)),
              )),
            ),
            pipe(
              document.body,
              O.fromNullable,
              O.map((x) => () => c.bodyResizePair.observer.observe(x)),
            ),
          ],
          RA.compact,
          RA.append(pipe(
            ctx.live.video.ele,
            O.filter((x) => !x.paused),
            O.alt(() => ctx.live.offlineSlate.ele),
            O.isSome,
            (x) => () => {
              // eslint-disable-next-line no-param-reassign
              ctx.mainState.chatPlaying = x;
            },
          )),
          IO.sequenceArray,
        )();
      }),
      switchMap(() => merge(
        pipe(
          fromEvent(
            ctx.channel,
            'message',
          ),
          tap(([key, val]) => pipe(
            [
              'lang',
              'bannedWords',
              'bannedWordRegexs',
              'bannedUsers',
              'filterExp',
              'simplifyChatField',
              'createBanButton',
              'fieldScale',
            ],
            (x: readonly (keyof UserConfig)[]) => x.includes(key),
            // eslint-disable-next-line max-len
            // eslint-disable-next-line @typescript-eslint/consistent-type-assertions
            (x) => (x ? ctx.setChangedConfig[key](val as never)
            : () => {}),
          )()),
        ),
        ...pipe(
          ctx.configKeys,
          RA.map((key) => pipe(
            // eslint-disable-next-line max-len
            // eslint-disable-next-line @typescript-eslint/consistent-type-assertions
            (ctx.cs[key] as Subject<unknown>),
            startWith(ctx.getConfig[key]()),
            bufferCount(2, 1),
            map(([x, y]) => diff(x, y)),
            tap((x) => ctx.settingLog([
              `Config ${key}`,
              JSON.stringify(x, undefined, 2),
            ])()),
          )),
        ),
        ctx.config$,
        pipe(
          ctx.live.video.ele,
          O.match(
            () => EMPTY,
            flow(
              videoToggleStream,
              map((playing) => playing || O.isSome(ctx.live.offlineSlate.ele)),
              tap((chatPlaying) => pipe(
                () => {
                  // eslint-disable-next-line no-param-reassign
                  ctx.mainState.chatPlaying = chatPlaying;
                },
                IO.apSecond(pipe(
                  ctx.flowChats,
                  RA.map(setChatPlayState),
                  RA.map(apply(ctx.mainState)),
                  IO.sequenceArray,
                )),
              )()),
            ),
          ),
        ),
        pipe(
          c.chatMutationPair.subject,
          map(onChatFieldMutate(
            ctx.chatScreen,
            ctx.flowChats,
            ctx.mainState,
            ctx.setAndBroadcastChangedConfig,
            ctx.settingLog,
          )),
          tap((x) => x()),
        ),
        pipe(
          c.documentMutationPair.subject,
          map(() => window.location.href),
          distinctUntilChanged(),
          skip(1),
          c.tapUpdateSettingsRect,
          tap((x) => IO.sequenceArray([
            ctx.mixLog(['URL Changed', x]),
            removeOldChats(ctx.flowChats)(0),
            ctx.mixLog([`Wait for ${c.urlDelay}ms...`]),
          ])()),
          delay(c.urlDelay),
          tap(ctx.reinitialize),
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
          tap((x) => onPlayerResize(
            x,
            ctx.flowChats,
            ctx.mainState,
            ctx.settingLog,
          )()),
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
          tap((panelRect) => ctx.updateSettingState((s) => ({
            ...s,
            panelRect,
          }))()),
        ),
      )),
      retry({
        delay: (e) => pipe(
          e,
          of,
          tap(ctx.mixLog(['Errored', e])),
          delay(c.errorRetryInterval),
          tap(ctx.reinitialize),
        ),
      }),
    )),
    T.fromIO,
  )),
  T.chainFirstIOK((ctx) => () => ctx.all$.subscribe({
    error: (x) => ctx.mixLog(['Stream error', x])(),
    complete: ctx.mixLog(['Stream complete']),
  })),
  T.chainFirstIOK((ctx) => ctx.reinitialize),
)();
