import FlowChat from '@/FlowChat';
import UserConfig from '@/UserConfig';

export default interface MainState {
  chatPlaying: boolean;
  playerRect: DOMRect;
  config: UserConfig;
  flowChats: FlowChat[];
}
