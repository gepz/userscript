import {
  pipe,
} from '@effect/data/Function';
import * as RA from '@effect/data/ReadonlyArray';
import * as Z from '@effect/io/Effect';
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
