import SettingState from '@/SettingState';
import SettingKeys from '@/settingUI/SettingKeys';
import SettingValues from '@/settingUI/SettingValues';
import computed from '@/settingUI/computed';

export default <T extends SettingKeys<SettingValues>>(k: T): (
  s: SettingState
) => T extends keyof SettingState ? SettingState[T]
: T extends keyof typeof computed ? ReturnType<(typeof computed)[T]>
: never => (
  // eslint-disable-next-line @typescript-eslint/consistent-type-assertions
  k in computed ? computed[
    // eslint-disable-next-line @typescript-eslint/consistent-type-assertions
    k as keyof typeof computed
  ] as (s: SettingState) => T extends keyof SettingState ? SettingState[T]
  : T extends keyof typeof computed ? ReturnType<(typeof computed)[T]>
  : never
  // eslint-disable-next-line @typescript-eslint/consistent-type-assertions
  : (s) => s[
  // eslint-disable-next-line @typescript-eslint/consistent-type-assertions
    k as keyof SettingState
  ] as T extends keyof SettingState ? SettingState[T]
  : T extends keyof typeof computed ? ReturnType<(typeof computed)[T]>
  : never
);
