import {
  Either as E,
} from 'effect';
import {
  pipe,
  flow,
} from 'effect/Function';
import {
  Option as O,
} from 'effect';

import {
  Array as A,
} from 'effect';

import {
  ReadonlyRecord as RR,
} from 'effect';

import TaggedValue, {
  makeType,
} from '@/TaggedValue';
import AssignGenericFunction from '@/type/AssignGenericFunction';
import {
  resolveGeneric,
} from '@/type/GenericMap';
import TargetLowerBoundFunc from '@/type/TargetLowerBoundFunc';
import type Type from '@/type/Type';

type RecordType = TaggedValue<'record', {
  [key: string]: Type,
}>;

export default RecordType;

export const of = makeType<RecordType>('record');

export const assignGeneric = (
  f: AssignGenericFunction<Type>,
): AssignGenericFunction<RecordType> => (
  typeMap,
) => (
  expected,
) => (
  synthed,
) => pipe();

export const targetLowerBound = (
  f: TargetLowerBoundFunc<Type>,
): TargetLowerBoundFunc<RecordType> => (
  targetConstraint,
) => (
  target,
) => flow(
  resolveGeneric,
  R.map(({
    type: source,
    map: sourceConstraint,
  }) => (source.tag === target.tag ? pipe(
    target.value,
    RR.toReadonlyArray,
    A.map(flow(
      ([key, type]) => pipe(
        source.value[key],
        E.fromNullable(`Source is missing property ${key}`),
        E.bimap(O.some, f(targetConstraint)(type)(sourceConstraint)),
        E.merge,
      ),
    )),
    A.getSomes,
    A.lookup(0),
  ) : O.some(`Type ${source.tag} is not assignable to type ${target.tag}`))),
);
