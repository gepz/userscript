import * as Z from 'effect/Effect';
import {
  render,
} from 'lit-html';

import FlowChat from '@/FlowChat';
import MainState from '@/MainState';
import chatNode from '@/chatNode';

export default (chat: FlowChat) => (
  mainState: MainState,
): Z.Effect<never, never, void> => Z.sync(() => render(
  chatNode(chat, mainState),
  chat.element,
));
