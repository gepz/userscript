import Editable, * as Ed from '@userscript/ui/Editable';
import {
  Array as A,
  pipe,
} from 'effect';
import {
  ConditionalKeys,
} from 'type-fest';

import AppCommander from '@/AppCommander';
import SettingState from '@/SettingState';
import UserConfig from '@/UserConfig';
import SettingDispatchable from '@/settingUI/SettingDispatchable';
import configEffect from '@/settingUI/configEffect';

export default (
  keyA: ConditionalKeys<SettingState, Editable<number>> & keyof UserConfig,
) => (
  keyB: ConditionalKeys<SettingState, Editable<number>> & keyof UserConfig,
) => (
  bFn: (vA: number) => (vB: number) => number,
) => (
  vA: Editable<number>,
) => (
  commander: AppCommander,
) => (
  s: SettingState,
): SettingDispatchable => pipe(
  Ed.value(vA),
  (a) => ({
    a,
    b: bFn(a)(Ed.value(s[keyB])),
  }),
  ({
    a,
    b,
  }) => pipe(
    [
      configEffect(keyA, a),
      configEffect(keyB, b),
    ],
    (xs) => (c: AppCommander) => pipe(
      xs,
      A.map((x) => x(c)),
      (effects): SettingDispatchable => [
        {
          ...s,
          [keyA]: vA,
          [keyB]: Ed.setValue(b)(s[keyB]),
        },
        ...effects,
      ],
    ),
  )(commander),
);
