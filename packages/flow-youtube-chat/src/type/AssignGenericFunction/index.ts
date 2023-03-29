import * as O from '@effect/data/Option';

import GenericMap from '@/type/GenericMap';
import type Type from '@/type/Type';

type AssignGenericFunction<T extends Type> = (
  typeMap: GenericMap
) => (
  expected: T
) => (
  synthed: T
) => O.Option<T>;

export default AssignGenericFunction;
