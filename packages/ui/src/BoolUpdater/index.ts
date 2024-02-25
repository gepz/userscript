import {
  apply,
  flip,
  pipe,
} from 'effect/Function';

import ExactTypeKey from '@/ExactTypeKey';
import StateDispatchable from '@/StateDispatchable';
import getChecked from '@/getChecked';

export default interface BoolUpdater<
  State,
  Props,
  AppCommander,
> {
  (key: ExactTypeKey<Props, boolean>): (
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
> => (
  key: ExactTypeKey<Props, boolean>,
) => flip((s, e) => pipe(
  // eslint-disable-next-line @typescript-eslint/consistent-type-assertions
  getChecked(e) as Props[ExactTypeKey<Props, boolean>],
  updateAt(key),
  flip,
  apply(s),
));

