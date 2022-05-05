import * as R from 'fp-ts/Reader';
import {
  pipe,
} from 'fp-ts/function';

import AppCommander from '@/AppCommander';
import SettingState from '@/SettingState';
import {
  TypeKey,
} from '@/TypeKey';
import UserConfig from '@/UserConfig';
import SettingDispatchable from '@/settingUI/SettingDispatchable';
import configEffect from '@/settingUI/configEffect';

export default (
  keyA: TypeKey<SettingState, number> & keyof UserConfig,
) => (
  keyB: TypeKey<SettingState, number> & keyof UserConfig,
) => (
  bFn: (vA: number) => (vB: number) => number,
) => (
  vA: number,
): R.Reader<AppCommander, R.Reader<SettingState, SettingDispatchable>> => (
  c,
) => (s) => pipe(
  bFn(vA)(s[keyB]),
  (newB) => pipe(
    [
      configEffect(keyA, vA),
      configEffect(keyB, newB),
    ],
    R.sequenceArray,
    R.map((effects): SettingDispatchable => [
      {
        ...s,
        [keyA]: vA,
        [keyB]: newB,
      },
      ...effects,
    ]),
  )(c.setConfig),
);
