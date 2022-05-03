import * as R from 'fp-ts/Reader';

import SettingConfig from '@/SettingConfig';
import UserConfigSetter from '@/UserConfigSetter';
import SettingDispatchable from '@/settingUI/SettingDispatchable';
import StateKey from '@/settingUI/StateKey';
import configEffect from '@/settingUI/configEffect';
import setComputed from '@/settingUI/setComputed';
import setState from '@/settingUI/setState';

export default <T>(
  k: StateKey<T>,
  v: T,
// eslint-disable-next-line @typescript-eslint/consistent-type-assertions
): R.Reader<SettingConfig, SettingDispatchable> => (k in setComputed ? (
  // eslint-disable-next-line @typescript-eslint/consistent-type-assertions
  setComputed[k as keyof typeof setComputed] as (
    v: unknown
  ) => R.Reader<SettingConfig, SettingDispatchable>
)(v)
: k in setState ? (
  // eslint-disable-next-line @typescript-eslint/consistent-type-assertions
  setState[k as keyof typeof setState] as (
    v: unknown
  ) => R.Reader<SettingConfig, SettingDispatchable>
)(v) : (c) => [
  {
    ...c.state,
    [k]: v,
  },
  ...(k in c.command.setConfig) ? [
    // eslint-disable-next-line @typescript-eslint/consistent-type-assertions
    configEffect(k as keyof UserConfigSetter, v as never)(
      c.command.setConfig,
    ),
  ]
  : [],
]);
