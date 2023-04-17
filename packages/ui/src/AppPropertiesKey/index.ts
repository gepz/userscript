import {
  ConditionalKeys,
} from 'type-fest';

import ComputedProperties from '@/ComputedProperties';

type AppPropertiesKey<
  State,
  C extends ComputedProperties<State>,
  T> = ConditionalKeys<State, T> | (
    ConditionalKeys<C, (s: State) => T>
    & ConditionalKeys<C, (s: State) => unknown>
  );

export default AppPropertiesKey;
