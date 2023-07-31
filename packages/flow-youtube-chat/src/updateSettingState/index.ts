import * as Z from 'effect/Effect';
import {
  pipe,
} from 'effect/Function';
import * as RA from 'effect/ReadonlyArray';
import {
  Dispatch,
  Dispatchable,
} from 'hyperapp';

import SettingState from '@/SettingState';

export default (
  apps: Dispatch<SettingState>[],
) => (
  dispatchable: Dispatchable<SettingState>,
): Z.Effect<never, never, void> => pipe(
  apps,
  RA.map((x) => Z.sync(() => x(dispatchable))),
  Z.all,
);
