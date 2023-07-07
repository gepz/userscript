import {
  BehaviorSubject,
} from 'rxjs';

import FlowChat from '@/FlowChat';
import UserConfig from '@/UserConfig';

export default interface MainState {
  chatPlaying: BehaviorSubject<boolean>;
  playerRect: BehaviorSubject<DOMRectReadOnly>;
  config: UserConfig;
  flowChats: BehaviorSubject<readonly FlowChat[]>;
}
