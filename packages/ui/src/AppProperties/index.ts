import AppPropertiesKey from '@/AppPropertiesKey';
import AppPropertiesValue from '@/AppPropertiesValue';
import ComputedProperties from '@/ComputedProperties';

type AppProperties<State, C extends ComputedProperties<State>> = {
  [K in AppPropertiesKey<State, C, unknown>]: AppPropertiesValue<State, C, K>
} & State;

export default AppProperties;

