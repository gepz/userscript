import * as Z from 'effect/Effect';

import UserConfigSetter from '@/UserConfigSetter';

export default interface AppCommander {
  setConfig: UserConfigSetter,
  act: {
    clearFlowChats: Z.Effect<void>,
  }
  provideLog: <T>(x: Z.Effect<T>) => Z.Effect<T>
}

