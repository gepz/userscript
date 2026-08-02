import * as Ed from '@userscript/ui/Editable';
import {
  pipe,
} from 'effect';

import AppCommander from '@/AppCommander';
import SettingState from '@/SettingState';
import UserConfigSetter from '@/UserConfigSetter';
import SettingDispatchable from '@/settingUI/SettingDispatchable';
import SettingKey from '@/settingUI/SettingKey';
import SettingProps from '@/settingUI/SettingProps';
import configEffect from '@/settingUI/configEffect';
import setComputed from '@/settingUI/setComputed';
import setState from '@/settingUI/setState';

export default <K extends SettingKey<unknown>>(k: K) => (
  v: SettingProps[K],
) => pipe(
  k in setComputed
    ? (
    // eslint-disable-next-line @typescript-eslint/consistent-type-assertions
      (setComputed[k as never] as (
        v: unknown,
      ) => (c: AppCommander) => (s: SettingState) => SettingDispatchable)
    )(v)
    : k in setState
      ? (
      // eslint-disable-next-line @typescript-eslint/consistent-type-assertions
        (setState[k] as (
          v: unknown,
        ) => (c: AppCommander) => (s: SettingState) => SettingDispatchable)
      )(v)
      : (c: AppCommander) => (s: SettingState): SettingDispatchable => [
        {
          ...s,
          [k]: v,
        },
        ...(k in c.setConfig
          ? [
            configEffect(

              // eslint-disable-next-line @typescript-eslint/consistent-type-assertions
              k as keyof UserConfigSetter,

              // eslint-disable-next-line @typescript-eslint/consistent-type-assertions
              (Ed.isEditable(v) ? Ed.value(v) : v) as never,
            )(c),
          ]
          : []),
      ],
);
