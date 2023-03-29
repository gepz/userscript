import * as Z from '@effect/io/Effect';
import m from 'mithril';

import FlowChat from '@/FlowChat';
import MainState from '@/MainState';
import chatNode from '@/chatNode';

export default (chat: FlowChat) => (
  mainState: MainState,
): Z.Effect<never, never, void> => Z.sync(() => m.render(
  chat.element,
  chatNode(chat, mainState),
));
