import {
  ConditionalKeys,
} from 'type-fest';

import ComputedProperties from '@/ComputedProperties';

type AppPropertyKeys<
  State,
  C extends ComputedProperties<State>,
  T> = keyof State & keyof C extends never
    ? ConditionalKeys<State, T> | (
      ConditionalKeys<C, (s: State) => T>
      & ConditionalKeys<C, (s: State) => unknown>
    )
    : never;

export default AppPropertyKeys;
