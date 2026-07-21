import {
  Effect as Z,
} from 'effect';

import UserConfigSetter from '@/UserConfigSetter';

export default interface AppCommander {
  setConfig: UserConfigSetter
  act: {
    clearFlowChats: Z.Effect<void>
  }
}
