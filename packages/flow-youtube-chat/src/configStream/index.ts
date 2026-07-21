import {
  Effect as Z,
  Array as A,
  Either as E,
  Option as O,
  Stream,
  SynchronizedRef,
} from 'effect';
import {
  pipe,
  apply,
} from 'effect/Function';

import ChatUpdateConfig from '@/ChatUpdateConfig';
import ConfigRefs from '@/ConfigRefs';
import LivePageState from '@/LivePageState';
import MainState from '@/MainState';
import UserConfig from '@/UserConfig';
import removeOldChats from '@/removeOldChats';
import renderChat from '@/renderChat';
import scaleChatField from '@/scaleChatField';
import setChatAnimation from '@/setChatAnimation';
import setChatPlayState from '@/setChatPlayState';
import throttleLatest from '@/stream/throttleLatest';

export default (
  provideLog: (x: Z.Effect<void>) => Z.Effect<void>,
  mainState: MainState,
  refs: ConfigRefs,
  chatScreen: HTMLElement,
  live: LivePageState,
): Stream.Stream<unknown> => {
  // SubscriptionRef.changes emits the current value first; dropping it gives
  // the plain Subject semantics most keys had, while keys that used
  // startWith(current) take .changes directly.
  const changed = <K extends keyof UserConfig>(
    key: K,
  ): Stream.Stream<UserConfig[K]> => Stream.drop(refs[key].changes, 1);

  return Stream.merge(
    pipe(
      refs.fieldScale.changes,
      Stream.mapEffect((x) => provideLog(scaleChatField(live)(x))),
    ),
    pipe(
      Stream.mergeAll<Partial<ChatUpdateConfig>, never, never>([
        pipe(
          Stream.mergeAll<unknown, never, never>([
            changed('displayModName'),
            changed('displaySuperChatAuthor'),
            changed('font'),
            changed('fontSize'),
            changed('fontWeight'),
            changed('laneCount'),
            changed('minSpacing'),
            changed('flowY1'),
            changed('flowY2'),
            pipe(
              refs.flowX1.changes,
              Stream.tap((x) => provideLog(Z.sync(() => Object.assign<
                CSSStyleDeclaration,
                Partial<CSSStyleDeclaration>
              >(chatScreen.style, {
                left: `${x * 100}%`,
                width: `${(mainState.config.value.flowX2 - x) * 100}%`,
              })))),
            ),
            pipe(
              changed('flowX2'),
              Stream.tap((x) => provideLog(Z.sync(() => Object.assign<
                CSSStyleDeclaration,
                Partial<CSSStyleDeclaration>
              >(chatScreen.style, {
                left: `${mainState.config.value.flowX1 * 100}%`,
                width: `${(x - mainState.config.value.flowX1) * 100}%`,
              })))),
            ),
            changed('textOnly'),
          ], {
            concurrency: 'unbounded',
          }),
          Stream.map(() => ({
            render: true,
            setAnimation: true,
          } as const)),
        ),
        pipe(
          Stream.mergeAll<unknown, never, never>([
            changed('color'),
            changed('ownerColor'),
            changed('moderatorColor'),
            changed('memberColor'),
            changed('shadowColor'),
            changed('chatOpacity'),
            changed('shadowFontWeight'),
            changed('displayChats'),
          ], {
            concurrency: 'unbounded',
          }),
          Stream.map(() => ({
            render: true,
          } as const)),
        ),
        pipe(
          changed('flowSpeed'),
          Stream.map(() => ({
            setPlayState: true,
          } as const)),
        ),
        pipe(
          Stream.mergeAll<unknown, never, never>([
            pipe(
              changed('maxChatCount'),
              Stream.tap((x) => provideLog(
                removeOldChats(mainState.flowChats)(x),
              )),
            ),
            changed('noOverlap'),
            changed('timingFunction'),
          ], {
            concurrency: 'unbounded',
          }),
          Stream.map(() => ({
            setAnimation: true,
          } as const)),
        ),
      ], {
        concurrency: 'unbounded',
      }),
      throttleLatest('180 millis'),
      Stream.map((x: Partial<ChatUpdateConfig>) => ({
        render: false,
        setAnimation: false,
        setPlayState: false,
        ...x,
      }) satisfies ChatUpdateConfig),
      Stream.mapEffect((c) => provideLog(pipe(
        SynchronizedRef.get(mainState.flowChats),
        Z.map(A.filter((x) => E.isRight(x.animationState))),
        Z.flatMap(Z.forEach((chat) => pipe(
          [
            c.render
              ? O.some(renderChat(chat))
              : O.none(),
            c.setAnimation
              ? O.some((state: MainState) => Z.ignore(
                setChatAnimation(chat)(state),
              ))
              : c.setPlayState
                ? O.some(setChatPlayState(chat))
                : O.none(),
          ],
          A.getSomes,
          Z.forEach(apply(mainState)),
        ))),
      ))),
    ),
  );
};
