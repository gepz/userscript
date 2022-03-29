import * as O from 'fp-ts/Option';
import {
  pipe,
} from 'fp-ts/function';

import FlowChat from '@/FlowChat';
import Logger from '@/Logger';
import MainState from '@/MainState';
import renderChat from '@/renderChat';
import setChatAnimation from '@/setChatAnimation';

export default (
  rect: O.Option<DOMRect>,
  flowChats: FlowChat[],
  mainState: MainState,
  mainLog: Logger,
): void => pipe(
  rect,
  O.match(
    () => () => {},
    (x) => () => {
      mainLog(['Resize detected'])();
      // eslint-disable-next-line no-param-reassign
      mainState.playerRect = x;
      flowChats.forEach((chat) => {
        renderChat(chat)(mainState)();
        setChatAnimation(chat, flowChats)(mainState)();
      });
    },
  ),
)();
