import {
  Cause,
} from 'effect';
import * as Z from 'effect/Effect';
import {
  pipe,
  apply,
} from 'effect/Function';
import * as RA from 'effect/ReadonlyArray';
import {
  merge,
  map,
  startWith,
  throttleTime,
  defer,
} from 'rxjs';

import ChatUpdateConfig from '@/ChatUpdateConfig';
import ConfigObservable from '@/ConfigObservable';
import LivePageState from '@/LivePageState';
import MainState from '@/MainState';
import removeOldChats from '@/removeOldChats';
import renderChat from '@/renderChat';
import scaleChatField from '@/scaleChatField';
import setChatAnimation from '@/setChatAnimation';
import setChatPlayState from '@/setChatPlayState';
import tapEffect from '@/tapEffect';

export default (
  provideLog: (x: Z.Effect<void>) => Z.Effect<void>,
  mainState: MainState,
  co: ConfigObservable,
  chatScreen: HTMLElement,
  live: LivePageState,
) => defer(() => merge(
  merge(
    co.bannedWordRegexes,
    co.bannedWords,
    co.bannedUsers,
  ),
  pipe(
    co.fieldScale,
    startWith(mainState.config.value.fieldScale),
    map(scaleChatField(live)),
    tapEffect(provideLog),
  ),
  pipe(
    merge(
      pipe(
        merge(
          co.displayModName,
          co.displaySuperChatAuthor,
          co.font,
          co.fontSize,
          co.fontWeight,
          co.laneCount,
          co.minSpacing,
          co.flowY1,
          co.flowY2,
          pipe(
            co.flowX1,
            startWith(mainState.config.value.flowX1),
            tapEffect((x) => provideLog(Z.sync(() => Object.assign<
            CSSStyleDeclaration,
            Partial<CSSStyleDeclaration>
            >(chatScreen.style, {
              left: `${x * 100}%`,
              width: `${(mainState.config.value.flowX2 - x) * 100}%`,
            })))),
          ),
          pipe(
            co.flowX2,
            tapEffect((x) => provideLog(Z.sync(() => Object.assign<
            CSSStyleDeclaration,
            Partial<CSSStyleDeclaration>
            >(chatScreen.style, {
              left: `${mainState.config.value.flowX1 * 100}%`,
              width: `${(x - mainState.config.value.flowX1) * 100}%`,
            })))),
          ),
          co.textOnly,
        ),
        map(() => ({
          render: true,
          setAnimation: true,
        } as const)),
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
        } as const)),
      ),
      pipe(
        co.flowSpeed,
        map(() => ({
          setPlayState: true,
        } as const)),
      ),
      pipe(
        merge(
          pipe(
            co.maxChatCount,
            map(removeOldChats(mainState.flowChats)),
            tapEffect(provideLog),
          ),
          co.noOverlap,
          co.timingFunction,
        ),
        map(() => ({
          setAnimation: true,
        } as const)),
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
      Z.succeed(mainState.flowChats.value),
      Z.map(RA.filter((x) => !x.animationEnded)),
      Z.flatMap(Z.forEach((chat) => pipe(
        Z.allSuccesses([
          c.render ? Z.succeed(renderChat(chat))
          : Z.fail(new Cause.NoSuchElementException()),
          c.setAnimation ? Z.succeed((state: MainState) => Z.ignore(
            setChatAnimation(chat)(state),
          )) : c.setPlayState ? Z.succeed(setChatPlayState(chat))
          : Z.fail(new Cause.NoSuchElementException()),
        ]),
        Z.flatMap(Z.forEach(apply(mainState))),
      ))),
    ))),
  ),
  co.lang,
  co.maxChatLength,
  co.simplifyChatField,
  co.createBanButton,
  co.createChats,
  co.fieldScale,
));
