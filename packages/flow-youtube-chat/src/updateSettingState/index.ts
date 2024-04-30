import {
  Array as A,
  Effect as Z,
} from 'effect';
import {
  pipe,
} from 'effect/Function';
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
