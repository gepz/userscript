import * as Z from 'effect/Effect';
import {
  pipe,
} from 'effect/Function';
import * as A from 'effect/Array';
import {
  Dispatch,
  Dispatchable,
} from 'hyperapp';

import SettingState from '@/SettingState';

export default (
  apps: Dispatch<SettingState>[],
) => (
  dispatchable: Dispatchable<SettingState>,
): Z.Effect<void> => pipe(
  apps,
  A.map((x) => Z.sync(() => x(dispatchable))),
  Z.all,
);
