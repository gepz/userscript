import {
  Effect as Z,
} from 'effect';

import UserConfigSetter from '@/UserConfigSetter';
import {
  LaneOverlay,
} from '@/laneOverlay';

export default interface AppCommander {
  setConfig: UserConfigSetter
  act: {
    clearFlowChats: Z.Effect<void>
  }
  laneOverlay: LaneOverlay
}
