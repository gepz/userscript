import {
  apply,
  flip,
  pipe,
} from '@effect/data/Function';

import AppPropertyKeys from '@/AppPropertyKeys';
import AppPropertyValues from '@/AppPropertyValues';
import ComputedProperties from '@/ComputedProperties';
import StateDispatchable from '@/StateDispatchable';
import getChecked from '@/getChecked';

export default interface BoolUpdater<
  State,
  C extends ComputedProperties<State>,
  AppCommander,
> {
  <K extends AppPropertyKeys<State, C, boolean>>(key: K): (
    c: AppCommander,
  ) => (
    s: State,
    e: Event,
  ) => StateDispatchable<State>
}

export const make = <
  State,
  C extends ComputedProperties<State>,
  AppCommander,
>(
  updateAt: <K extends AppPropertyKeys<State, C, unknown>>(k: K) => (
    v: AppPropertyValues<State, C, K>,
  ) => (c: AppCommander) => (s: State) => StateDispatchable<State>,
): BoolUpdater<
State,
C,
AppCommander
> => <K extends AppPropertyKeys<State, C, boolean>>(
  key: K,
) => flip((s, e) => pipe(
  // eslint-disable-next-line @typescript-eslint/consistent-type-assertions
  getChecked(e) as AppPropertyValues<State, C, K>,
  updateAt(key),
  flip,
  apply(s),
));
