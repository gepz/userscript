import * as SM from 'effect/SortedMap';
import * as Str from 'effect/String';
import {
  tapNonNull,
} from '@userscript/tap';
import {
  pipe,
} from 'effect/Function';

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
    SM.get()
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
