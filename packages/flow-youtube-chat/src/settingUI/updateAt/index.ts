import * as R from 'fp-ts/Reader';
import {
  pipe,
} from 'fp-ts/function';

import AppCommander from '@/AppCommander';
import SettingState from '@/SettingState';
import UserConfig from '@/UserConfig';
import UserConfigSetter from '@/UserConfigSetter';
import isEditable from '@/isEditable';
import Expression from '@/settingUI/EditableExpression/Expression';
import toJsepExp from '@/settingUI/EditableExpression/toJsepExp';
import SettingDispatchable from '@/settingUI/SettingDispatchable';
import StateKey from '@/settingUI/StateKey';
import UpdateType from '@/settingUI/UpdateType';
import configEffect from '@/settingUI/configEffect';
import setComputed from '@/settingUI/setComputed';
import setState from '@/settingUI/setState';
import Editable, * as Ed from '@/ui/Editable';

export default <T extends UpdateType>(k: StateKey<T>) => (v: T) => pipe(
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
      configEffect(
        // eslint-disable-next-line max-len
        // eslint-disable-next-line @typescript-eslint/consistent-type-assertions
        k as keyof UserConfigSetter,
        Array.isArray(v)
        && v.length === 2
        && isEditable(k)(v[0]) ? Ed.value(
          // eslint-disable-next-line max-len
          // eslint-disable-next-line @typescript-eslint/consistent-type-assertions
          v as unknown as Editable<UserConfig[keyof UserConfig]['val']>,
        // eslint-disable-next-line max-len
        // eslint-disable-next-line @typescript-eslint/consistent-type-assertions
        ) : k === 'filterExp' ? toJsepExp(v as Expression)
        // eslint-disable-next-line max-len
        // eslint-disable-next-line @typescript-eslint/consistent-type-assertions
        : v as never,
      )(c.setConfig),
    ]
    : [],
  ],
);
