import {
  pipe,
} from 'effect/Function';
import * as O from 'effect/Option';
import * as RA from 'effect/ReadonlyArray';
import * as Z from 'effect/Effect';

import ChatData from '@/ChatData';
import FlowChat from '@/FlowChat';
import MainState from '@/MainState';
import UserConfig from '@/UserConfig';
import getChatFontSize from '@/getChatFontSize';
import getChatLane from '@/getChatLane';
import intervalTooSmall from '@/intervalTooSmall';
import renderChat from '@/renderChat';
import setChatAnimation from '@/setChatAnimation';

const emptyElement = document.createElement('span');

export default (
  getData: (config: UserConfig) => ChatData,
  chatScrn: HTMLElement,
  mainState: MainState,
): Z.Effect<never, never, void> => (pipe(
  {
    getData,
    element: emptyElement,
    lane: -1,
    animation: O.none(),
    animationEnded: false,
    width: 2,
    height: getChatFontSize(mainState),
    y: 0,
  } satisfies FlowChat,
  (x: FlowChat) => getChatLane(x, O.none(), 0)(mainState).interval,
  intervalTooSmall,
  (x) => x(mainState.config.value),
) ? Z.unit
: pipe(
  mainState.flowChats.value,
  RA.findFirstIndex((chat) => chat.animationEnded
    || mainState.flowChats.value.length
    >= mainState.config.value.maxChatCount),
  O.match({
    onNone: (): Z.Effect<never, never, HTMLElement> => pipe(
      Z.sync(() => document.createElement('span')),
      Z.tap((element) => Z.sync(() => chatScrn.append(element))),
      Z.tap((element) => Z.sync(() => element.classList.add('fyc_chat'))),
      Z.zipLeft(Z.logDebug('Flow chat element added')),
    ),
    onSome: (index): Z.Effect<never, never, HTMLElement> => pipe(
      Z.gen(function* (_) {
        const chats = mainState.flowChats;
        const chat = RA.unsafeGet(chats.value, index);

        yield* _(chat.animation.pipe(
          Z.flatMap((animation) => Z.sync(() => animation.cancel())),
          Z.ignore,
        ));

        chats.next(RA.remove(chats.value, index));
        return chat.element;
      }),
    ),
  }),
  Z.map((element): FlowChat => ({
    getData,
    element,
    lane: -1,
    animation: O.none(),
    animationEnded: false,
    width: 2,
    height: getChatFontSize(mainState),
    y: 0,
  })),
  Z.flatMap((flowChat) => pipe(
    Z.succeed(mainState),
    Z.tap(renderChat(flowChat)),
    Z.flatMap(setChatAnimation(flowChat)),
    Z.matchEffect({
      onFailure: () => pipe(
        Z.sync(() => flowChat.element.remove()),
        Z.zipLeft(Z.logDebug('Flow chat element removed')),
      ),
      onSuccess: (x) => Z.sync(() => mainState.flowChats.next(
        RA.append(mainState.flowChats.value, x.newChat)
      )), 
    }),
  )),
));
