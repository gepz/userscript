import SettingState from '@/SettingState';
import SettingKeys from '@/settingUI/SettingKeys';
import computed from '@/settingUI/computed';

export default <T extends SettingKeys<unknown>>(k: T): (
  s: SettingState
) => T extends keyof SettingState ? SettingState[T]
: T extends keyof typeof computed ? ReturnType<(typeof computed)[T]>
: never => (
  // eslint-disable-next-line @typescript-eslint/consistent-type-assertions
  k in computed ? computed[k as never] as (s: SettingState) => never
  // eslint-disable-next-line @typescript-eslint/consistent-type-assertions
  : (s) => s[k as never] as never
);
