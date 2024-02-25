import {
  Semigroup,
} from '@effect/typeclass/Semigroup';
import * as O from 'effect/Option';

import GenericMap from '@/type/GenericMap';
import type Type from '@/type/Type';

type TypeWithMap<T extends Type = Type> = {
  type: T,
  map: GenericMap
};

export default TypeWithMap;

export const of = <T extends Type>(x: T) => ({
  type: x,
  map: {},
});

