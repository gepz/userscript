import FlowChat from '@/FlowChat';
import MainState from '@/MainState';
import getFlowChatProgress from '@/getFlowChatProgress';

export default (
  chat: FlowChat,
  mainState: MainState,
): DOMRect => {
  const {
    getConfig,
  } = mainState;

  const x = (mainState.playerRect.width * getConfig.flowX2())
  - ((chat.width + (mainState.playerRect.width * (
    getConfig.flowX2() - getConfig.flowX1()
  ))) * getFlowChatProgress(chat));

  return new DOMRect(x, chat.y, chat.width, chat.height);
};
