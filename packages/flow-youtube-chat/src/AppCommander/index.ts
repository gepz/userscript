import * as Z from '@effect/io/Effect';

import UserConfigSetter from '@/UserConfigSetter';

export default interface AppCommander {
  setConfig: UserConfigSetter,
  act: {
    clearFlowChats: Z.Effect<never, never, void>,
  }
}
