import {
  Either as E,
} from 'effect';
import {
  pipe,
} from 'effect/Function';

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
