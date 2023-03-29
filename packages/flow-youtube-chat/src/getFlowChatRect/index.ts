import {
  pipe,
} from '@effect/data/Function';

import FlowChat from '@/FlowChat';
import MainState from '@/MainState';
import getFlowChatProgress from '@/getFlowChatProgress';

export default (
  chat: FlowChat,
  mainState: MainState,
): DOMRect => pipe(
  mainState.config,
  (x) => (mainState.playerRect.width * x.flowX2)
  - ((chat.width + (mainState.playerRect.width * (
    x.flowX2 - x.flowX1
  ))) * getFlowChatProgress(chat)),
  (x) => new DOMRect(x, chat.y, chat.width, chat.height),
);
