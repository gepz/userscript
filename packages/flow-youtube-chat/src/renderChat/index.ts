import * as IO from 'fp-ts/IO';
import * as R from 'fp-ts/Reader';
import m from 'mithril';

import FlowChat from '@/FlowChat';
import MainState from '@/MainState';
import chatNode from '@/chatNode';

export default (chat: FlowChat): R.Reader<MainState, IO.IO<void>> => (
  mainState,
) => () => m.render(
  chat.element,
  chatNode(chat, mainState),
);
