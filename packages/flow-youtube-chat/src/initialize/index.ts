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
import * as IOO from 'fp-ts/IOOption';
import * as O from 'fp-ts/Option';
import * as R from 'fp-ts/Reader';
import * as RA from 'fp-ts/ReadonlyArray';
import * as T from 'fp-ts/Task';
import {
  pipe,
  apply,
  flow,
} from 'fp-ts/function';
import {
  asyncScheduler,
  EMPTY,
  fromEvent,
  interval,
  merge,
  Subject,
  filter,
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
} from 'rxjs';

import packageJson from '@/../package.json';
import ChatUpdateConfig from '@/ChatUpdateConfig';
import ConfigSubject from '@/ConfigSubject';
import FlowChat from '@/FlowChat';
import LivePage from '@/LivePage';
import Logger from '@/Logger';
import MainState from '@/MainState';
import SettingState from '@/SettingState';
import UserConfig from '@/UserConfig';
import UserConfigGetter from '@/UserConfigGetter';
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
import scriptIdentifier from '@/scriptIdentifier';
import setChatAnimation from '@/setChatAnimation';
import setChatAppCss from '@/setChatAppCss';
import setChatPlayState from '@/setChatPlayState';
import setSettingFromConfig from '@/setSettingFromConfig';
import settingStateInit from '@/settingStateInit';
import settingsComponent from '@/settingsComponent';
import simpleWrap from '@/simpleWrap';
import toggleChatButton from '@/toggleChatButton';
import videoToggleStream from '@/videoToggleStream';

type LiveElementState<T> = T extends () => infer R ? {
  ele: R,
  read: T,
} : never;

export default (): Promise<unknown> => pipe(
  defaultUserConfig,
  flow(
    T.bindTo('userConfig'),
    T.bind('configKeys', (x) => T.of(
    // eslint-disable-next-line @typescript-eslint/consistent-type-assertions
      Object.keys(x.userConfig) as (keyof UserConfig)[],
    )),
    T.bind('getConfig', (ctx): T.Task<UserConfigGetter> => T.of(pipe(
      ctx.configKeys,
      RA.map((x) => [x, () => ctx.userConfig[x].val]),
      Object.fromEntries,
    ))),
    T.bind('mainState', (x): T.Task<MainState> => T.of({
      chatPlaying: true,
      playerRect: new DOMRect(0, 0, 600, 400),
      getConfig: x.getConfig,
    })),
    T.bind('configSubject', (ctx): T.Task<ConfigSubject> => T.of(pipe(
      ctx.configKeys,
      RA.map((x) => [x, new Subject()]),
      Object.fromEntries,
    ))),
    T.bind('setConfigPlain', (ctx): T.Task<UserConfigSetter> => T.of(pipe(
      ctx.configKeys,
      RA.map((x) => [
        x,
        async (
          val: never,
        ) => {
        // eslint-disable-next-line no-param-reassign
          ctx.userConfig[x].val = val;
          ctx.configSubject[x].next(val);
        },
      ]),
      Object.fromEntries,
    ))),
    T.apS('channel', T.of(new BroadcastChannel<
    [keyof UserConfig, UserConfig[keyof UserConfig]['val']]
    >(scriptIdentifier))),
    T.bind('setConfig', (ctx): T.Task<UserConfigSetter> => T.of(pipe(
      ctx.configKeys,
      RA.map((x) => [
        x,
        async (
          val: never,
        ) => {
          if (deepEq(ctx.getConfig[x](), val)) return;
          ctx.setConfigPlain[x](val);
          const item = ctx.userConfig[x];
          ctx.channel.postMessage([x, val]);
          GM.setValue(item.gmKey, item.toGm(val));
        },
      ]),
      Object.fromEntries,
    ))),
  ),
  flow(
    T.apS('reinitSubject', T.fromIO(() => new Subject<void>())),
    T.bind('reinitialize', (ctx) => T.of(() => {
      requestAnimationFrame(() => forwardTo(ctx.reinitSubject)());
    })),
    T.bind('toggleChatButtonInit', (ctx) => T.of({
      lang: ctx.getConfig.lang(),
      displayChats: ctx.getConfig.displayChats(),
    })),
    T.bind('wrappedToggleChatBtn', (ctx) => T.of(simpleWrap(
      toggleChatButton(ctx.setConfig),
      ctx.toggleChatButtonInit,
    ))),
    T.apS('flowChats', T.of<FlowChat[]>([])),
    T.bind('wrappedSetting', (ctx) => T.of(simpleWrap(
      settingsComponent({
        setConfig: ctx.setConfig,
        act: {
          clearFlowChats: async () => removeOldChats(0)(ctx.flowChats)(),
        },
      }),
      settingStateInit(ctx.getConfig),
    ))),
    T.bind('mainLog', (ctx) => T.of<Logger>(
      (x) => () => ctx.wrappedSetting.dispatch((s): SettingState => ({
        ...s,
        eventLog: appendLog(s.eventLog)(x),
      })),
    )),
    T.bind('mixLog', (ctx) => T.of<Logger>(pipe(
      [
        ctx.mainLog,
        consoleLog,
      ],
      R.sequenceArray,
      R.map(IO.sequenceArray),
    ))),
  ),
  T.chainFirstIOK((ctx) => pipe(
    [
      ['Version', packageJson.version],
      ['User Agent', window.navigator.userAgent],
      ['UserConfig', JSON.stringify(ctx.userConfig)],
    ],
    RA.map(ctx.mainLog),
    IO.sequenceArray,
  )),
  T.bind('cs', (ctx) => T.of<ConfigSubject>(pipe(
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
          IO.chainFirst(() => () => ctx.wrappedSetting.dispatch(
            // eslint-disable-next-line max-len
            // eslint-disable-next-line @typescript-eslint/consistent-type-assertions, max-len
            setSettingFromConfig(k)(v as UserConfig[keyof UserConfigGetter]['val']),
          )),
          IO.chain((x) => (k in ctx.toggleChatButtonInit
            ? () => ctx.wrappedToggleChatBtn.dispatch(x)
            : () => {})),
          (x) => () => requestAnimationFrame(x),
        )()),
      ),
    ]),
    Object.fromEntries,
  ))),
  T.apS('livePage', T.fromIO(livePageYt)),
  T.bind('liveElementKeys', (ctx) => T.of(
    // eslint-disable-next-line @typescript-eslint/consistent-type-assertions
    Object.keys(ctx.livePage) as (keyof LivePage)[],
  )),
  T.bind('live', (ctx) => T.of(pipe(
    <T extends keyof LivePage>(key: T) => ({
      ele: O.none,
      read: ctx.livePage[key],
    }),
    (initState): {
      [P in keyof LivePage]: LiveElementState<LivePage[P]>;
    } => pipe(
      ctx.liveElementKeys,
      RA.map((x) => [x, initState(x)]),
      Object.fromEntries,
    ),
  ))),
  T.apS('chatScreen', T.fromIO(createChatScreen)),
  T.bind('config$', (ctx) => pipe(
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
        tap((scale) => pipe(
          ctx.live.chatField.ele,
          IOO.fromOption,
          IOO.chain((field) => IOO.fromIO(() => pipe(
            [
              pipe(
                O.fromNullable(field.parentElement),
                O.map((x) => () => {
                  // eslint-disable-next-line no-param-reassign
                  x.style.transformOrigin = `${scale >= 1 ? 'top'
                    : 'bottom'} left`;

                  // eslint-disable-next-line no-param-reassign
                  x.style.transform = `scale(${scale})`;
                  // eslint-disable-next-line no-param-reassign
                  x.style.width = `${100 / scale}%`;
                  // eslint-disable-next-line no-param-reassign
                  x.style.height = `${field.offsetHeight}px`;
                }),
              ),
              pipe(
                ctx.live.chatScroller.ele,
                O.map((scroller) => () => {
                  // eslint-disable-next-line no-param-reassign
                  scroller.scrollTop = scroller.scrollHeight;
                }),
              ),
            ],
            RA.compact,
            IO.sequenceArray,
          ))),
        )()),
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
                tap((x) => {
                  ctx.chatScreen.style.left = `${x * 100}%`;
                  ctx.chatScreen.style.width = `${
                    (ctx.getConfig.flowX2() - x) * 100
                  }%`;
                }),
              ),
              pipe(
                cs.flowX2,
                tap((x) => {
                  ctx.chatScreen.style.left = `${
                    ctx.getConfig.flowX1() * 100
                  }%`;

                  ctx.chatScreen.style.width = `${
                    (x - ctx.getConfig.flowX1()) * 100
                  }%`;
                }),
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
                tap((x) => removeOldChats(x)(ctx.flowChats)()),
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
            },
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
      cs.lang,
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
        tap(() => ctx.setConfig.filterExp(defaultFilter(ctx.getConfig))),
      ),
    )),
    T.of,
  )),
  T.bind('all$', (ctx) => pipe(
    {
      eq: O.getEq(eqStrict).equals,
      initDelay: 100,
      urlDelay: 1700,
      changeDetectInterval: 700,
    },
    IO.of,
    IO.apS('css', mainCss),
    IO.apS('documentMutationPair', observePair(MutationObserver)),
    IO.apS('chatMutationPair', observePair(MutationObserver)),
    IO.apS('playerResizePair', observePair(ResizeObserver)),
    IO.map((c) => pipe(
      ctx.reinitSubject,
      observeOn(asyncScheduler),
      delay(c.initDelay),
      tap(ctx.mixLog(['Init'])),
      switchMap(() => pipe(
        interval(c.changeDetectInterval),
        filter(() => pipe(
          ctx.liveElementKeys,
          RA.map((key) => pipe(
            ctx.live[key].read(),
            O.fromPredicate((newEle) => !c.eq(ctx.live[key].ele, newEle)),
            O.map((x) => () => {
              ctx.live[key].ele = x;
            }),
            O.map(IO.apSecond(ctx.mixLog([`${key} changed`]))),
          )),
          RA.compact,
          IO.sequenceArray,
          IO.map(RA.isNonEmpty),
        )()),
        startWith(0),
      )),
      tap(ctx.mixLog(['Loading...'])),
      tap(() => {
        removeOldChats(0)(ctx.flowChats)();
        c.documentMutationPair.observer.disconnect();
        c.documentMutationPair.observer.observe(document, {
          childList: true,
          subtree: true,
        });

        c.chatMutationPair.observer.disconnect();
        c.playerResizePair.observer.disconnect();
        document.head.append(c.css);
        pipe(
          [
            pipe(
              ctx.live.chatField.ele,
              O.map((x) => () => {
                setChatAppCss(x)();
                c.chatMutationPair.observer.observe(x, {
                  childList: true,
                });
              }),
            ),
            pipe(
              ctx.live.chatTicker.ele,
              O.map((x) => () => c.chatMutationPair.observer.observe(x, {
                childList: true,
              })),
            ),
            pipe(
              ctx.live.player.ele,
              O.map((x) => () => {
                c.playerResizePair.observer.observe(x);
                x.insertAdjacentElement('afterbegin', ctx.chatScreen);
              }),
            ),
            pipe(
              ctx.live.toggleChatBtnParent.ele,
              O.map((x) => () => x.append(ctx.wrappedToggleChatBtn.node)),
            ),
            pipe(
              ctx.live.settingNextElement.ele,
              O.map((x) => () => {
                x.insertAdjacentElement(
                  'beforebegin',
                  ctx.wrappedSetting.node,
                );
              }),
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
            (x: (keyof UserConfig)[]) => x.includes(key),
            // eslint-disable-next-line max-len
            // eslint-disable-next-line @typescript-eslint/consistent-type-assertions
            (x) => (x ? () => ctx.setConfigPlain[key](val as never)
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
            tap((x) => ctx.mainLog([
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
            (x) => pipe(
              videoToggleStream(x),
              map((playing) => playing
                || O.isSome(ctx.live.offlineSlate.ele)),
              tap((chatPlaying) => {
                // eslint-disable-next-line no-param-reassign
                ctx.mainState.chatPlaying = chatPlaying;
                ctx.flowChats.forEach(
                  (chat) => setChatPlayState(chat)(ctx.mainState)(),
                );
              }),
            ),
          ),
        ),
        pipe(
          c.chatMutationPair.subject,
          map(onChatFieldMutate(
            ctx.chatScreen,
            ctx.flowChats,
            ctx.mainState,
            ctx.setConfig,
            ctx.mainLog,
          )),
          tap((x) => x()),
        ),
        pipe(
          c.documentMutationPair.subject,
          map(() => window.location.href),
          distinctUntilChanged(),
          skip(1),
          tap((x) => {
            ctx.mixLog(['URL Changed', x])();
            removeOldChats(0)(ctx.flowChats)();
            ctx.mixLog([`Wait for ${c.urlDelay}ms...`])();
          }),
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
            ctx.mainLog,
          )),
        ),
      )),
      retry({
        delay: (e) => pipe(
          e,
          of,
          tap(ctx.mixLog(['Errored', e])),
          delay(5000),
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
