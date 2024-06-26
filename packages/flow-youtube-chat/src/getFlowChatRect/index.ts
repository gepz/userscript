import {
  pipe,
} from 'effect';

import FlowChat from '@/FlowChat';
import UserConfig from '@/UserConfig';
import getFlowChatProgress from '@/getFlowChatProgress';

export default (
  chat: FlowChat,
  config: UserConfig,
  playerRect: DOMRectReadOnly,
): DOMRectReadOnly => pipe(
  config,
  (x) => (playerRect.width * x.flowX2)
  - ((chat.width + (playerRect.width * (
    x.flowX2 - x.flowX1
  ))) * getFlowChatProgress(chat.animationState)),
  (x) => new DOMRectReadOnly(x, chat.y, chat.width, chat.height),
);
