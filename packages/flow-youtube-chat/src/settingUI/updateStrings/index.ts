import * as P from 'fp-ts/Predicate';
import * as R from 'fp-ts/Reader';
import * as RA from 'fp-ts/ReadonlyArray';
import {
  apply,
  flow,
  pipe,
} from 'fp-ts/function';
import * as S from 'fp-ts/string';

import AppCommander from '@/AppCommander';
import SettingState from '@/SettingState';
import flip from '@/flip';
import SettingDispatchable from '@/settingUI/SettingDispatchable';
import StateKey from '@/settingUI/StateKey';
import updateAt from '@/settingUI/updateAt';
import getValue from '@/ui/getValue';

export default (
  key: StateKey<readonly string[]>,
): R.Reader<
  AppCommander,
  (s: SettingState, e: Event) => SettingDispatchable
  > => flip(
  (s, e) => pipe(
    getValue(e),
    flow(
      S.split(/\r\n|\n/),
      RA.filter(P.not(S.isEmpty)),
    ),
    (x) => updateAt(key, x),
    flip,
    apply(s),
  ),
);
