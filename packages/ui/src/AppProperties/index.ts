import AppPropertyKeys from '@/AppPropertyKeys';
import AppPropertyValues from '@/AppPropertyValues';
import ComputedProperties from '@/ComputedProperties';

type AppProperties<State, C extends ComputedProperties<State>> = {
  [K in AppPropertyKeys<State, C, unknown>]: AppPropertyValues<State, C, K>
};

export default AppProperties;
