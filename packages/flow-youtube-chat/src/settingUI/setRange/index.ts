import * as I from '@effect/data/Identity';
import * as R from 'fp-ts/Reader';
import {
  pipe,
} from '@effect/data/Function';

import AppCommander from '@/AppCommander';
import SettingState from '@/SettingState';
import {
  TypeKey,
} from '@/TypeKey';
import UserConfig from '@/UserConfig';
import SettingDispatchable from '@/settingUI/SettingDispatchable';
import configEffect from '@/settingUI/configEffect';
import Editable, * as Ed from '@/ui/Editable';

export default (
  keyA: TypeKey<SettingState, Editable<number>> & keyof UserConfig,
) => (
  keyB: TypeKey<SettingState, Editable<number>> & keyof UserConfig,
) => (
  bFn: (vA: number) => (vB: number) => number,
) => (
  vA: Editable<number>,
): R.Reader<AppCommander, R.Reader<SettingState, SettingDispatchable>> => (
  c,
) => (s) => pipe(
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
    R.sequenceArray,
    R.map((effects): SettingDispatchable => [
      {
        ...s,
        [keyA]: vA,
        [keyB]: Ed.setValue(b)(s[keyB]),
      },
      ...effects,
    ]),
  )(c.setConfig),
);
