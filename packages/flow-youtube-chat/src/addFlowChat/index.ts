import {
  Array as A,
  Effect as Z,
  Either as E,
  Option as O,
  pipe,
  SynchronizedRef,
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

// [element to reuse (none: create a fresh one), list with the donor removed]
type Recycled = readonly [O.Option<HTMLElement>, readonly FlowChat[]];

export default Z.fnUntraced(function* (
  data: ChatData,
  chatScrn: HTMLElement,
  mainState: MainState,
) {
  const chatFontSize = yield * getChatFontSize(mainState);
  const seedChat = (element: HTMLElement): FlowChat => ({
    data,
    element,
    lane: -1,
    animationState: E.left('NotStarted'),
    width: 2,
    height: chatFontSize,
    y: 0,
  });

  if (yield * pipe(
    getChatLane(seedChat(emptyElement), O.none(), 0)(mainState),
    Z.map(O.exists(({
      interval,
    }) => !intervalTooSmall(interval)(mainState.config.value))),
  )) {
    // Selecting the recycle/evict target and removing it is one atomic
    // update: the other branch streams also write flowChats, so a scan done
    // outside the update could act on a stale index — cancelling the wrong
    // chat, or dying in A.unsafeGet (a defect the resilient wrapper answers
    // with a full reinitialize). Mirrors dropFlowChat in
    // @/recheckChatOnSettle.
    const recycled = yield * SynchronizedRef.modifyEffect(
      mainState.flowChats,
      (chats): Z.Effect<Recycled> => pipe(
        A.findFirstIndex(chats, (chat) => E.match(chat.animationState, {
          onLeft: (x) => x === 'Ended',
          onRight: () => false,
        })),
        // Nothing recyclable while at the cap: flowing one more would
        // exceed maxChatCount, so the earliest chat is evicted by design,
        // even mid-flight.
        O.orElse(() => (chats.length >= mainState.config.value.maxChatCount
          ? O.some(0)
          : O.none())),
        O.match({
          onNone: () => Z.succeed<Recycled>([O.none(), chats]),
          onSome: (index) => Z.gen(function* () {
            const chat = A.unsafeGet(chats, index);

            yield * chat.animationState.pipe(
              Z.tap((animation) => Z.sync(() => animation.cancel())),
              Z.ignore,
            );

            return [
              O.some(chat.element),
              A.remove(chats, index),
            ] satisfies Recycled;
          }),
        }),
      ),
    );

    yield * pipe(
      O.match(recycled, {
        onNone: (): Z.Effect<HTMLElement> => pipe(
          Z.sync(() => document.createElement('span')),
          Z.tap((element) => Z.sync(() => chatScrn.append(element))),
          Z.tap((element) => Z.sync(() => element.classList.add('fyc_chat'))),
          Z.zipLeft(Z.logDebug('Flow chat element added')),
        ),
        onSome: (element) => Z.succeed(element),
      }),
      Z.map(seedChat),
      Z.flatMap((flowChat) => pipe(
        Z.succeed(mainState),
        Z.tap(renderChat(flowChat)),
        Z.flatMap(setChatAnimation(flowChat)),
        Z.matchEffect({
          onFailure: () => pipe(
            Z.sync(() => flowChat.element.remove()),
            Z.zipLeft(Z.logDebug('Flow chat element removed')),
          ),
          onSuccess: (x) => SynchronizedRef.update(
            mainState.flowChats,
            A.append(x.newChat),
          ),
        }),
      )),
    );
  }
});
