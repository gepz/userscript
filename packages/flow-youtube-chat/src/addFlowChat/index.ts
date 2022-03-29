import * as IOO from 'fp-ts-contrib/IOOption';
import * as IO from 'fp-ts/IO';
import * as O from 'fp-ts/Option';
import * as RA from 'fp-ts/ReadonlyArray';
import {
  pipe,
} from 'fp-ts/function';
import log from 'loglevel';

import ChatData from '@/ChatData';
import FlowChat from '@/FlowChat';
import MainState from '@/MainState';
import UserConfigGetter from '@/UserConfigGetter';
import getChatFontSize from '@/getChatFontSize';
import getChatLane from '@/getChatLane';
import intervalTooSmall from '@/intervalTooSmall';
import renderChat from '@/renderChat';
import setChatAnimation from '@/setChatAnimation';

const emptyElement = document.createElement('span');

export default (
  getData: (getConfig: UserConfigGetter) => ChatData,
  flowChats: FlowChat[],
  chatScrn: HTMLElement,
  mainState: MainState,
): IO.IO<void> => (pipe(
  {
    getData,
    element: emptyElement,
    lane: -1,
    animation: O.none,
    animationDuration: 0,
    animationEnded: false,
    width: 2,
    height: getChatFontSize(mainState),
    y: 0,
  },
  (x: FlowChat) => getChatLane(
    x,
    0,
    flowChats,
  )(mainState).interval,
  intervalTooSmall,
  (x) => x(mainState.getConfig),
) ? () => {}
: () => {
  const offScreenIndex = pipe(
    flowChats,
    RA.findIndex(
      (chat) => chat.animationEnded
   || flowChats.length >= mainState.getConfig.maxChatCount(),
    ),
  );

  const element: HTMLElement = pipe(
    offScreenIndex,
    O.map((x) => flowChats[x].element),
    O.getOrElseW(() => document.createElement('span')),
  );

  pipe(
    offScreenIndex,
    O.match(
      () => () => {
        log.debug('CreateFlowChat');
        chatScrn.append(element);
      },
      (i) => pipe(
        () => flowChats.splice(i, 1)[0].animation,
        IOO.chain(
          (oldAnimation) => IOO.fromIO(() => oldAnimation.cancel()),
        ),
      ),
    ),
  )();

  const flowChat: FlowChat = {
    getData,
    element,
    lane: -1,
    animation: O.none,
    animationDuration: 0,
    animationEnded: false,
    width: 2,
    height: getChatFontSize(mainState),
    y: 0,
  };

  element.classList.add('fyc_chat');
  pipe(
    mainState,
    IO.of,
    IO.chainFirst(renderChat(flowChat)),
    IO.chain(setChatAnimation(
      flowChat,
      flowChats,
    )),
    IO.chain((x) => (x ? () => flowChats.push(flowChat)
    : () => flowChat.element.remove())),
  )();
});
