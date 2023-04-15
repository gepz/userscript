import {
  apply,
  pipe,
} from '@effect/data/Function';

import AppPropertyKeys from '@/AppPropertyKeys';
import AppPropertyValues from '@/AppPropertyValues';
import ComputedProperties from '@/ComputedProperties';
import StateDispatchable from '@/StateDispatchable';
import getValue from '@/getValue';
import {
  Setter,
} from '@/setter';

export default interface InputUpdater<
  State,
  C extends ComputedProperties<State>,
  AppCommander,
> {
  <K extends AppPropertyKeys<State, C, unknown>>(key: K): (
    setter: Setter<string, AppPropertyValues<State, C, K>>
  ) => (
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
  getState: <K extends AppPropertyKeys<State, C, unknown>>(k: K) => (
    s: State
  ) => AppPropertyValues<State, C, K>,
  updateAt: <K extends AppPropertyKeys<State, C, unknown>>(k: K) => (
    v: AppPropertyValues<State, C, K>,
  ) => (c: AppCommander) => (s: State) => StateDispatchable<State>,
): InputUpdater<
State,
C,
AppCommander
> => <K extends AppPropertyKeys<State, C, unknown>>(
  key: K,
) => (
  setter: Setter<string, AppPropertyValues<State, C, K>>,
) => (c) => (s, e) => pipe(
  getValue(e),
  setter,
  apply(getState(key)(s)),
  updateAt(key),
  (x) => x(c)(s),
);
