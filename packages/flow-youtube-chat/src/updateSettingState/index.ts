import {
  Array as A,
  Effect as Z,
  pipe,
} from 'effect';
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
