import {
  Either as E,
} from 'effect';
import {
  flow,
  pipe,
} from 'effect/Function';
import {
  Option as O,
} from 'effect';

import {
  Array as A,
} from 'effect';

import {
  omit,
} from 'effect/Struct';

import TaggedValue, {
  makeType,
} from '@/TaggedValue';
import AssignGenericFunction from '@/type/AssignGenericFunction';
import GenericMap, {
  resolveGeneric,
} from '@/type/GenericMap';
import TargetLowerBoundFunc from '@/type/TargetLowerBoundFunc';
import type Type from '@/type/Type';

export type FinalReturnType = Exclude<Type, FunctionType>;

type FunctionType = TaggedValue<'function', {
  constraint: GenericMap,
  paramType: Type,
  returnType: Type,
}>;

export default FunctionType;

export const of = makeType<FunctionType>('function');

export const returnOf = ({
  value,
}: FunctionType): Type => pipe(
  value.returnType,
  (x) => (x.tag === 'function' ? of({
    ...x.value,
    constraint: merge(value.constraint)(x.value.constraint),
  }) : x),
);

export const fromParamAndReturn = (paramType: Type) => (
  returnType: Type,
): FunctionType => of({
  constraint: {},
  paramType,
  returnType,
});

// Generic-assignment design scratchwork lives in filter_logic.md (see the
// filter-editor entry in docs/backlog.md).

const tt: <T extends undefined>(x: T) => T = (x: unknown): undefined => undefiend;

const sourceT = <T extends 's' | 'd'>(x: T) => <T extends 's' | 'd' | 'f'>(
  a: [T, T],
) => a;

const targetT: <T extends 's' | 'd'>(x: T) => (
  a: ['s', 'f'] | ['s' | 'd']
) => readonly ['s' | 'd', 's' | 'd'] = sourceT;

const sourceT2 = <T extends 's' | 'd'>(x: T) => <T extends 's' | 'd' | 'f'>(
  a: <T extends 's' | 'd' | 'f'>(x: [T, T]) => T,
) => (b: [T, T]): T => a(b);

const targetT2: <T extends 's' | 'd'>(x: T) => (
  a: (x: ['s', 's']) => 's'
) => (b: ['s', 's']) => 's' = sourceT2;

const sourceT3 = <T extends string>(x: [T, T]): 5 => 5;
const targetT3: (x: ['s', 's']) => 5 = sourceT3;

export const targetLowerBound = (
  f: TargetLowerBoundFunc<Type>,
): TargetLowerBoundFunc<FunctionType> => (
  targetConstraint,
) => (
  target,
) => flow(
  resolveGeneric,
  R.map(({
    type: source,
    map: sourceConstraint,
  }) => (source.tag === target.tag ? pipe(
    {
      newTargetConstraint: merge(targetConstraint)(target.value.constraint),
      newSourceConstraint: merge(sourceConstraint)(source.value.constraint),
    },
    (c) => pipe(
      f(c.newTargetConstraint)(target.value.paramType)(
        c.newSourceConstraint,
      )(source.value.paramType),
    ),
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
