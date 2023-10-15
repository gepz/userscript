import Editable, * as Ed from '@userscript/ui/Editable';
import {
  pipe,
} from 'effect/Function';

import AppCommander from '@/AppCommander';
import SettingState from '@/SettingState';
import UserConfig from '@/UserConfig';
import UserConfigSetter from '@/UserConfigSetter';
import isEditable from '@/isEditable';
// import Expression from '@/settingUI/editableExpression/Expression';
// eslint-disable-next-line max-len
// import editableExpressionToJsep from '@/settingUI/editableExpression/editableExpressionToJsep';
import SettingDispatchable from '@/settingUI/SettingDispatchable';
import SettingKey from '@/settingUI/SettingKey';
import SettingProps from '@/settingUI/SettingProps';
import configEffect from '@/settingUI/configEffect';
import setComputed from '@/settingUI/setComputed';
import setState from '@/settingUI/setState';

export default <K extends SettingKey<unknown>>(k: K) => (
  v: SettingProps[K],
) => pipe(
  k in setComputed ? (
  // eslint-disable-next-line @typescript-eslint/consistent-type-assertions
    setComputed[k as never] as (
      v: unknown
    ) => (c: AppCommander) => (s: SettingState) => SettingDispatchable
  )(v)
  : k in setState ? (
  // eslint-disable-next-line @typescript-eslint/consistent-type-assertions
    setState[k as never] as (
      v: unknown
    ) => (c: AppCommander) => (s: SettingState) => SettingDispatchable
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
      )(c),
    ]
    : [],
  ],
);
