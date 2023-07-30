import {
  BehaviorSubject,
} from 'rxjs';

import FlowChat from '@/FlowChat';
import UserConfig from '@/UserConfig';
import UserConfigGetter from '@/UserConfigGetter';
import UserConfigSetter from '@/UserConfigSetter';

export default interface MainState {
  chatPlaying: BehaviorSubject<boolean>;
  playerRect: BehaviorSubject<DOMRectReadOnly>;
  config: {
    value: UserConfig,
    getConfig: UserConfigGetter,
    setConfig: UserConfigSetter,
  },
  flowChats: BehaviorSubject<readonly FlowChat[]>;
}
