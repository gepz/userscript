import {
  Array as A,
  Effect as Z,
  Either as E,
  Option as O,
  pipe,
} from 'effect';

import ChatData from '@/ChatData';
import FlowChat from '@/FlowChat';
import MainState from '@/MainState';
import getChatFontSize from '@/getChatFontSize';
import getChatLane from '@/getChatLane';
import intervalTooSmall from '@/intervalTooSmall';
import renderChat from '@/renderChat';
import setChatAnimation from '@/setChatAnimation';

const emptyElement = document.createElement('span');

export default (
  data: ChatData,
  chatScrn: HTMLElement,
  mainState: MainState,
// eslint-disable-next-line func-names
): Z.Effect<void> => Z.gen(function* () {
  const chatFontSize = yield* getChatFontSize(mainState);
  if (yield* pipe(
    Z.succeed({
      data,
      element: emptyElement,
      lane: -1,
      animationState: E.left('NotStarted'),
      width: 2,
      height: chatFontSize,
      y: 0,
    } satisfies FlowChat),
    Z.flatMap((x: FlowChat) => getChatLane(x, O.none(), 0)(mainState)),
    Z.map(({
      interval,
    }) => !intervalTooSmall(interval)(mainState.config.value)),
  )) {
    yield* pipe(
      mainState.flowChats.value,
      A.findFirstIndex((chat) => E.match(chat.animationState, {
        onLeft: (x) => x === 'Ended',
        onRight: () => false,
      }) || mainState.flowChats.value.length
    >= mainState.config.value.maxChatCount),
      O.match({
        onNone: (): Z.Effect<HTMLElement> => pipe(
          Z.sync(() => document.createElement('span')),
          Z.tap((element) => Z.sync(() => chatScrn.append(element))),
          Z.tap((element) => Z.sync(() => element.classList.add('fyc_chat'))),
          Z.zipLeft(Z.logDebug('Flow chat element added')),
        ),
        onSome: (index): Z.Effect<HTMLElement> => pipe(
          // eslint-disable-next-line func-names
          Z.gen(function* () {
            const chats = mainState.flowChats;
            const chat = A.unsafeGet(chats.value, index);

            yield* chat.animationState.pipe(
              Z.flatMap((animation) => Z.sync(() => animation.cancel())),
              Z.ignore,
            );

            chats.next(A.remove(chats.value, index));
            return chat.element;
          }),
        ),
      }),
      Z.map((element): FlowChat => ({
        data,
        element,
        lane: -1,
        animationState: E.left('NotStarted'),
        width: 2,
        height: chatFontSize,
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
            A.append(mainState.flowChats.value, x.newChat),
          )),
        }),
      )),
    );
  }
});
