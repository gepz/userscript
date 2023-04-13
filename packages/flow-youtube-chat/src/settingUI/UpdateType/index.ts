import SettingState from '@/SettingState';
import SettingKeys from '@/settingUI/SettingKeys';
import computed from '@/settingUI/computed';

type UpdateType = {
  [P in SettingKeys<unknown>]: P extends keyof SettingState ? SettingState[P]
  : P extends keyof typeof computed ? ReturnType<(typeof computed)[P]>
  : never
}[SettingKeys<unknown>];

export default UpdateType;
