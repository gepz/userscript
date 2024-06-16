import {
  SynchronizedRef,
} from 'effect';
import {
  BehaviorSubject,
} from 'rxjs';

import FlowChat from '@/FlowChat';
import UserConfig from '@/UserConfig';
import UserConfigGetter from '@/UserConfigGetter';
import UserConfigSetter from '@/UserConfigSetter';

export default interface MainState {
  chatPlaying: SynchronizedRef.SynchronizedRef<boolean>;
  playerRect: SynchronizedRef.SynchronizedRef<DOMRectReadOnly>;
  config: {
    value: UserConfig,
    getConfig: UserConfigGetter,
    setConfig: UserConfigSetter,
  },
  flowChats: BehaviorSubject<readonly FlowChat[]>;
}
