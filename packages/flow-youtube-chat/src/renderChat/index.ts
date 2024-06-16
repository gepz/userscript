import {
  Effect as Z,
} from 'effect';
import {
  render,
} from 'lit-html';

import FlowChat from '@/FlowChat';
import MainState from '@/MainState';
import chatNode from '@/chatNode';

export default (chat: FlowChat) => (
  mainState: MainState,
): Z.Effect<void> => chatNode(chat, mainState).pipe(
  Z.flatMap((node) => Z.sync(() => render(node, chat.element))),
);
