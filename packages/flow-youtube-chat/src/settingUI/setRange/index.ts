import {
  pipe,
} from '@effect/data/Function';
import * as I from '@effect/data/Identity';
import * as RA from '@effect/data/ReadonlyArray';

import AppCommander from '@/AppCommander';
import SettingState from '@/SettingState';
import {
  TypeKey,
} from '@/TypeKey';
import UserConfig from '@/UserConfig';
import SettingDispatchable from '@/settingUI/SettingDispatchable';
import configEffect from '@/settingUI/configEffect';
import Editable, * as Ed from '@userscript/ui/Editable';

export default (
  keyA: TypeKey<SettingState, Editable<number>> & keyof UserConfig,
) => (
  keyB: TypeKey<SettingState, Editable<number>> & keyof UserConfig,
) => (
  bFn: (vA: number) => (vB: number) => number,
) => (
  vA: Editable<number>,
) => (
  commander: AppCommander,
) => (
  s: SettingState,
): SettingDispatchable => pipe(
  {
    a: Ed.value(vA),
  },
  I.let('b', ({
    a,
  }) => bFn(a)(Ed.value(s[keyB]))),
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
      RA.map((x) => x(c)),
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
