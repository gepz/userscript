import {
  pipe,
} from 'effect/Function';
import * as RA from 'effect/ReadonlyArray';
import {
  VNode,
} from 'hyperapp';

import AppCommander from '@/AppCommander';
import SettingState from '@/SettingState';

export default <T>(
  f: (xs: VNode<SettingState>[]) => T,
) => (
  xs: ((c: AppCommander) => (s: SettingState) => VNode<SettingState>)[],
) => (c: AppCommander) => (s: SettingState) => pipe(
  xs,
  RA.map((x) => x(c)(s)),
  f,
);

