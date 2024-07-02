import {
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
  Z.forEach((x) => Z.sync(() => x(dispatchable))),
);
