import * as E from 'effect/Either';
import {
  flow,
  pipe,
} from 'effect/Function';
import * as I from 'effect/Identity';
import * as O from 'effect/Option';
import * as RA from 'effect/ReadonlyArray';
import {
  omit,
} from 'effect/Struct';
import * as R from 'fp-ts/Reader';

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

/*
{0 un} simple {0 un2, 1 un2} (1)
{0 un} simple {0 un2} (simple), {0 un2, 1 simple}

{0 un} un {0 un2, 1 simple} (1)
none                   X

{0 un, 1 un} simple {0 un2, 1 un2} (1)
{0 un, 1 un} simple {0 un2} (simple), {0 un2, 1 simple}

{0 un2, 1 simple} simple {0 un3} (1)
{0 un2, 1 simple} simple {0 un3} (simple), {0 un2, 1 simple}

{0 un2, 1 simple} record {0 un3} (1)
none                X

{0 un2, 1 simple} un3 {0 un3} (1)
none                X

{0 un2, 1 un2} simple {0 un3} (1)
{0 un2, 1 un2} simple {0 un3} (un2), {0 un3, 1 un2}

{0 un} simple {0 un2} (1)
{0 un} simple {0 un2} (simple), {0 un2, 1 simple}

{0 un, 1 un} simple {0 un2} (1)
{0 un, 1 un} simple {0 un2} (simple), {0 un2, 1 simple}
*/

// export const assignGeneric = (
//   f: AssignGenericFunction<Type>,
// ): AssignGenericFunction<FunctionType> => (
//   typeMap,
// ) => (
//   expected,
// ) => (
//   synthed,
// ) => pipe(
//   synthed.value,
//   (s) => (s.paramType.tag === 'generic' ? pipe(
//     s.paramType.value,
//     (generic) => generic in s.typeMap ? pipe(
//       {
//         generic,
//         typeMap: omit([`${generic}`])(s.typeMap),
//         paramType: expected.value.paramType,
//       },
//       I.bind('returnType', (x) => f({
//             ...merge(typeMap)(x.typeMap),
//             [generic]: x.paramType,
//           })(expected.value.returnType)(s.returnType)),

//     ) : generic in typeMap ? pipe(
//       {
//         generic,
//         typeMap: s.typeMap,
//         paramType: expected.value.paramType,
//       },
//       I.bind('returnType', (x) => f(typeMap)(
//         expected.value.returnType
//         )(s.returnType)),

//     )
//     // ? s.paramType.value in s.typeMap ? pipe(
//     //   s.paramType.value,
//     //   (x) => ({
//     //     paramGeneric: x,
//     //     typeMap: omit([`${x}`])(s.typeMap),
//     //     paramType: expected.value.paramType,
//     //   })
//     //   I.bind('returnType', (x) => f({
//     //     ...typeMap,
//     //     [x.paramGeneric]: x.paramType,
//     //   })(expected.value.returnType)(s.returnType)),
//     // ) : pipe(
//     //   f(merge(typeMap)(s.typeMap))(s.paramType),
//     // ) : pipe(
//     //   f(merge(typeMap)(s.typeMap))(s.paramType),
//     // )),
// );

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
