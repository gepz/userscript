import * as E from '@effect/data/Either';
import {
  pipe,
} from '@effect/data/Function';

import TaggedValue, {
  makeType,
} from '@/TaggedValue';
import {
  resolveGeneric,
} from '@/type/GenericMap';
import TargetLowerBoundFunc from '@/type/TargetLowerBoundFunc';
import type Type from '@/type/Type';

type GenericType = TaggedValue<'generic', number>;

export default GenericType;

export const of = makeType<GenericType>('generic');

export const targetLowerBound = (
  f: TargetLowerBoundFunc<Type>,
): TargetLowerBoundFunc<GenericType> => (
  target,
) => (
  source,
) => pipe(
  resolveGeneric(target),
  (t) => pipe(
    source.type,
    (type) => (type.tag === 'generic' ? f(t)(resolveGeneric(source)) : pipe(
      f(t)(source),
      E.map(() => ({
        [`${target.type.value}`]: type,
      })),
    )),
  ),
);
