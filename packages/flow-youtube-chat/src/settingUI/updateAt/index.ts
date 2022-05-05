import * as R from 'fp-ts/Reader';
import {
  pipe,
} from 'fp-ts/function';

import AppCommander from '@/AppCommander';
import SettingState from '@/SettingState';
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
) => pipe(
  k in setComputed ? (
  // eslint-disable-next-line @typescript-eslint/consistent-type-assertions
    setComputed[k as keyof typeof setComputed] as (
      v: unknown
    ) => R.Reader<AppCommander, R.Reader<SettingState, SettingDispatchable>>
  )(v)
  : k in setState ? (
  // eslint-disable-next-line @typescript-eslint/consistent-type-assertions
    setState[k as keyof typeof setState] as (
      v: unknown
    ) => R.Reader<AppCommander, R.Reader<SettingState, SettingDispatchable>>
  )(v) : (c: AppCommander) => (s: SettingState): SettingDispatchable => [
    {
      ...s,
      [k]: v,
    },
    ...(k in c.setConfig) ? [
    // eslint-disable-next-line @typescript-eslint/consistent-type-assertions
      configEffect(k as keyof UserConfigSetter, v as never)(
        c.setConfig,
      ),
    ]
    : [],
  ],
);
