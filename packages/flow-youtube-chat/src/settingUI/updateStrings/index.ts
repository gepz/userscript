import * as P from 'fp-ts/Predicate';
import * as R from 'fp-ts/Reader';
import * as RA from 'fp-ts/ReadonlyArray';
import {
  flow,
  pipe,
} from 'fp-ts/function';
import * as S from 'fp-ts/string';

import SettingConfig from '@/SettingConfig';
import SettingState from '@/SettingState';
import flip from '@/flip';
import SettingDispatchable from '@/settingUI/SettingDispatchable';
import StateKey from '@/settingUI/StateKey';
import updateAt from '@/settingUI/updateAt';
import getValue from '@/ui/getValue';

export default (
  key: StateKey<readonly string[]>,
): R.Reader<
  SettingConfig,
  (s: SettingState, e: Event) => SettingDispatchable
  > => flip(
  (_, e) => pipe(
    getValue(e),
    flow(
      S.split(/\r\n|\n/),
      RA.filter(P.not(S.isEmpty)),
    ),
    (x) => updateAt(key, x),
  ),
);
