import {
  apply,
  flip,
  pipe,
} from '@effect/data/Function';
import {
  ConditionalKeys,
} from 'type-fest';

import StateDispatchable from '@/StateDispatchable';
import getChecked from '@/getChecked';

export default interface BoolUpdater<
  State,
  Props,
  AppCommander,
> {
  <K extends ConditionalKeys<Props, boolean>>(key: K): (
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
  updateAt: <K extends keyof Props>(k: K) => (
    v: Props[K],
  ) => (c: AppCommander) => (s: State) => StateDispatchable<State>,
): BoolUpdater<
State,
Props,
AppCommander
> => <K extends ConditionalKeys<Props, boolean>>(
  key: K,
) => flip((s, e) => pipe(
  // eslint-disable-next-line @typescript-eslint/consistent-type-assertions
  getChecked(e) as Props[K],
  updateAt(key),
  flip,
  apply(s),
));
