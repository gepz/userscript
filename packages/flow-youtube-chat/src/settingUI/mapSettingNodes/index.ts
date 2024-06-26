import {
  Array as A,
  pipe,
} from 'effect';
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
  A.map((x) => x(c)(s)),
  f,
);
