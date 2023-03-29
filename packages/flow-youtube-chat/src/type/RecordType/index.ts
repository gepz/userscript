import {
  pipe,
  flow,
} from '@effect/data/Function';
import * as O from '@effect/data/Option';
import * as RA from '@effect/data/ReadonlyArray';
import * as E from '@effect/data/Either';
import * as R from 'fp-ts/Reader';
import * as RR from 'fp-ts/ReadonlyRecord';

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
    RA.map(flow(
      ([key, type]) => pipe(
        source.value[key],
        E.fromNullable(`Source is missing property ${key}`),
        E.bimap(O.some, f(targetConstraint)(type)(sourceConstraint)),
        E.merge,
      ),
    )),
    RA.compact,
    RA.lookup(0),
  ) : O.some(`Type ${source.tag} is not assignable to type ${target.tag}`))),
);
