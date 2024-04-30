import {
  apply,
  pipe,
} from 'effect/Function';

import StateDispatchable from '@/StateDispatchable';
import getValue from '@/getValue';
import {
  Setter,
} from '@/setter';

export default interface InputUpdater<
  State,
  Props,
  AppCommander,
> {
  <K extends keyof Props>(key: K): (
    setter: Setter<string, Props[K]>
  ) => (
    c: AppCommander,
  ) => (
    s: State,
    e: Event,
  ) => StateDispatchable<State>
}

export const make = <
  State,
  Props,
  AppCommander,
>(
  getState: <K extends keyof Props>(k: K) => (
    s: State
  ) => Props[K],
  updateAt: <K extends keyof Props>(k: K) => (
    v: Props[K],
  ) => (c: AppCommander) => (s: State) => StateDispatchable<State>,
): InputUpdater<
State,
Props,
AppCommander
> => <K extends keyof Props>(
  key: K,
) => (
  setter: Setter<string, Props[K]>,
) => (c) => (s, e) => pipe(
  getValue(e),
  setter,
  apply(getState(key)(s)),
  updateAt(key),
  (x) => x(c)(s),
);

