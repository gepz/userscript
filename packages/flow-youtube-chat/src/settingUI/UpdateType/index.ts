import SettingState from '@/SettingState';
import StateKey from '@/settingUI/StateKey';
import computed from '@/settingUI/computed';

type UpdateType = {
  [P in StateKey<unknown>]: P extends keyof SettingState ? SettingState[P]
  : P extends keyof typeof computed ? ReturnType<(typeof computed)[P]>
  : never
}[StateKey<unknown>];

export default UpdateType;
