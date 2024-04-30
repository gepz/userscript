import tapNonNull from '@userscript/tap-non-null';
import {
  pipe,
} from 'effect/Function';
import {
  SortedMap as SM,
} from 'effect';
import {
  String as Str,
} from 'effect';

import type GenericType from '@/type/GenericType';
import type Type from '@/type/Type';
import type TypeWithMap from '@/type/TypeWithMap';

type GenericMap = SM.SortedMap<`${number}`, Exclude<Type, GenericType>>;

export default GenericMap;

export const resolveGeneric = ({
  type,
  map,
}: TypeWithMap): {
  type: Exclude<Type, GenericType>,
  map: GenericMap,
} => (
  type.tag === 'generic' ? pipe(
    SM.get(),
    map[`${type.value}`],
    (x) => tapNonNull(
      x,
      'Defect: Mapping not found for the given generic type',
    ),
    (x) => ({
      map: SM.empty<`${number}`, Exclude<Type, GenericType>>(Str.Order),
      type: x,
    }),
  ) : ({
    map,
    type,
  }));
