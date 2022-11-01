import UserConfigSetter from '@/UserConfigSetter';

export default interface AppCommander {
  setConfig: UserConfigSetter,
  act: {
    clearFlowChats: () => Promise<void>,
  }
}
