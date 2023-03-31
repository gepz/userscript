import {
  pipe,
  apply,
} from '@effect/data/Function';
import * as O from '@effect/data/Option';
import * as RA from '@effect/data/ReadonlyArray';
import * as Z from '@effect/io/Effect';
import {
  merge,
  map,
  startWith,
  throttleTime,
  defer,
} from 'rxjs';

import ChatUpdateConfig from '@/ChatUpdateConfig';
import ConfigObservable from '@/ConfigObservable';
import FlowChat from '@/FlowChat';
import LivePageState from '@/LivePageState';
import MainState from '@/MainState';
import removeOldChats from '@/removeOldChats';
import renderChat from '@/renderChat';
import scaleChatField from '@/scaleChatField';
import setChatAnimation from '@/setChatAnimation';
import setChatPlayState from '@/setChatPlayState';
import tapEffect from '@/tapEffect';

export default (
  provideLog: (x: Z.Effect<never, never, void>) => Z.Effect<never, never, void>,
  mainState: MainState,
  co: ConfigObservable,
  chatScreen: HTMLElement,
  flowChats: FlowChat[],
  live: LivePageState,
) => defer(() => merge(
  merge(
    co.bannedWordRegexs,
    co.bannedWords,
    co.bannedUsers,
  ),
  pipe(
    co.fieldScale,
    startWith(mainState.config.fieldScale),
    map(scaleChatField(live)),
    tapEffect(provideLog),
  ),
  pipe(
    merge(
      pipe(
        merge(
          co.font,
          co.fontSize,
          co.fontWeight,
          co.laneCount,
          co.minSpacing,
          co.flowY1,
          co.flowY2,
          pipe(
            co.flowX1,
            startWith(mainState.config.flowX1),
            tapEffect((x) => provideLog(Z.sync(() => Object.assign<
            CSSStyleDeclaration,
            Partial<CSSStyleDeclaration>
            >(chatScreen.style, {
              left: `${x * 100}%`,
              width: `${(mainState.config.flowX2 - x) * 100}%`,
            })))),
          ),
          pipe(
            co.flowX2,
            tapEffect((x) => provideLog(Z.sync(() => Object.assign<
            CSSStyleDeclaration,
            Partial<CSSStyleDeclaration>
            >(chatScreen.style, {
              left: `${mainState.config.flowX1 * 100}%`,
              width: `${(x - mainState.config.flowX1) * 100}%`,
            })))),
          ),
          co.textOnly,
        ),
        map(() => ({
          render: true,
          setAnimation: true,
        })),
      ),
      pipe(
        merge(
          co.color,
          co.ownerColor,
          co.moderatorColor,
          co.memberColor,
          co.shadowColor,
          co.chatOpacity,
          co.shadowFontWeight,
          co.displayChats,
        ),
        map(() => ({
          render: true,
        })),
      ),
      pipe(
        co.flowSpeed,
        map(() => ({
          setPlayState: true,
        })),
      ),
      pipe(
        merge(
          pipe(
            co.maxChatCount,
            map(removeOldChats(flowChats)),
            tapEffect(provideLog),
          ),
          co.noOverlap,
          co.timingFunction,
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
    map((x: Partial<ChatUpdateConfig>) => ({
      render: false,
      setAnimation: false,
      setPlayState: false,
      ...x,
    }) satisfies ChatUpdateConfig),
    tapEffect((c) => provideLog(pipe(
      flowChats,
      RA.filter((x) => !x.animationEnded),
      RA.map((chat) => pipe(
        [
          pipe(
            renderChat(chat),
            O.liftPredicate(() => c.render),
          ),
          (c.setAnimation ? O.some(
            setChatAnimation(chat, flowChats),
          ) : c.setPlayState ? O.some(setChatPlayState(chat))
          : O.none()),
        ],
        RA.compact,
        RA.map(apply(mainState)),
        (x) => Z.all(x),
      )),
      (x) => Z.all(x),
      Z.asUnit,
    ))),
  ),
  co.lang,
  co.maxChatLength,
  co.simplifyChatField,
  co.createBanButton,
  co.createChats,
  co.displayModName,
  co.displaySuperChatAuthor,
  co.fieldScale,
));
