import * as Z from '@effect/io/Effect';

import UserConfigSetter from '@/UserConfigSetter';

export default interface AppCommander {
  setConfig: UserConfigSetter,
  act: {
    clearFlowChats: Z.Effect<never, never, void>,
  }
  provideLog: <T>(x: Z.Effect<never, never, T>) => Z.Effect<never, never, T>
}
