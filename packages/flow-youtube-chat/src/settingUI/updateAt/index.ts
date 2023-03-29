import {
  pipe,
} from '@effect/data/Function';
import * as R from 'fp-ts/Reader';

import AppCommander from '@/AppCommander';
import SettingState from '@/SettingState';
import UserConfig from '@/UserConfig';
import UserConfigSetter from '@/UserConfigSetter';
import isEditable from '@/isEditable';
// import Expression from '@/settingUI/EditableExpression/Expression';
// eslint-disable-next-line max-len
// import editableExpressionToJsep from '@/settingUI/EditableExpression/editableExpressionToJsep';
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
    ...(k in c.setConfig && k !== 'filterExp') ? [
      configEffect(
        // eslint-disable-next-line max-len
        // eslint-disable-next-line @typescript-eslint/consistent-type-assertions
        k as keyof UserConfigSetter,
        Array.isArray(v)
        && v.length === 2
        && isEditable(k)(v[0]) ? Ed.value(
          // eslint-disable-next-line max-len
          // eslint-disable-next-line @typescript-eslint/consistent-type-assertions
          v as unknown as Editable<UserConfig[keyof UserConfig]>,
        // eslint-disable-next-line max-len
        // eslint-disable-next-line @typescript-eslint/consistent-type-assertions
        )
        //  : k === 'filterExp' ? editableExpressionToJsep(v as Expression)
        // eslint-disable-next-line max-len
        // eslint-disable-next-line @typescript-eslint/consistent-type-assertions
        : v as never,
      )(c.setConfig),
    ]
    : [],
  ],
);
