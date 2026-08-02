import {
  Either as E,
} from 'effect';

import type GenericMap from '@/type/GenericMap';
import type Type from '@/type/Type';
import type TypeWithMap from '@/type/TypeWithMap';

type TargetLowerBoundFunc<T extends Type> = (
  target: TypeWithMap<T>
) => (
  source: TypeWithMap
  // effect's Either puts the success channel first: GenericMap is the
  // inferred lower bound on success, string the assignability error.
) => E.Either<GenericMap, string>;

export default TargetLowerBoundFunc;
