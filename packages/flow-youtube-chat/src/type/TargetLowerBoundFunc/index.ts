import * as E from '@effect/data/Either';

import type GenericMap from '@/type/GenericMap';
import type Type from '@/type/Type';
import type TypeWithMap from '@/type/TypeWithMap';

type TargetLowerBoundFunc<T extends Type> = (
  target: TypeWithMap<T>
) => (
  source: TypeWithMap
) => E.Either<string, GenericMap>;

export default TargetLowerBoundFunc;
