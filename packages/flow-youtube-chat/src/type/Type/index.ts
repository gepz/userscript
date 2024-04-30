import {
  Semigroup,
} from '@effect/typeclass/Semigroup';
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


import AssignGenericFunction from '@/type/AssignGenericFunction';
import FunctionType, * as functionType from '@/type/FunctionType';
import GenericType, * as genericType from '@/type/GenericType';
import RecordType, * as recordType from '@/type/RecordType';
import SimpleType, * as simpleType from '@/type/SimpleType';
import TargetLowerBoundFunc from '@/type/TargetLowerBoundFunc';
import TupleType, * as tupleType from '@/type/TupleType';
import * as typeWithMap from '@/type/TypeWithMap';
import UnionType, * as unionType from '@/type/UnionType';
import UnitType, * as unitType from '@/type/UnitType';
import UnknownType, * as unknownType from '@/type/UnknownType';

type Type = GenericType
| SimpleType
| FunctionType
| TupleType
| RecordType
| UnknownType
| UnitType
| UnionType;

export default Type;

const bothAreType = <T extends Type>(tag: T['tag']) => (
  types: readonly [Type, Type],
): types is readonly [T, T] => types[0].tag === tag && types[1].tag === tag;

const assignGeneric: AssignGenericFunction<Type> = (
  typeMap,
) => (
  expected,
) => (
  synthed,
) => pipe(
  [expected, synthed] as const,
  (x) => (bothAreType<SimpleType>('simple')(x) ? simpleType.assignGeneric(
    assignGeneric,
  )(typeMap)(x[0])(x[1])
  : bothAreType<TupleType>('tuple')(x) ? tupleType.assignGeneric(
    assignGeneric,
  )(typeMap)(x[0])(x[1])
  : bothAreType<RecordType>('record')(x) ? recordType.assignGeneric(
    assignGeneric,
  )(typeMap)(x[0])(x[1])
  : bothAreType<FunctionType>('function')(x) ? functionType.assignGeneric(
    assignGeneric,
  )(typeMap)(x[0])(x[1])
  : bothAreType<UnknownType>('unknown')(x) ? unknownType.assignGeneric(
    assignGeneric,
  )(typeMap)(x[0])(x[1])
  : bothAreType<UnitType>('unit')(x) ? unitType.assignGeneric(
    assignGeneric,
  )(typeMap)(x[0])(x[1])
  : bothAreType<UnionType>('union')(x) ? unionType.assignGeneric(
    assignGeneric,
  )(typeMap)(x[0])(x[1]) : O.none()),
);

const semigroup = (
  lowerBound: TargetLowerBoundFunc<Type>,
): Semigroup<Type> => ({
  concat: (a, b) => pipe(
    [
      ...(a.tag === 'union' ? a.value : [a]),
      ...(b.tag === 'union' ? b.value : [b]),
    ],
    A.uniq({
      equals: flow(
        (x, y) => [typeWithMap.of(x), typeWithMap.of(y)] as const,
        ([x, y]) => pipe(
          lowerBound(x)(y),
          E.tap(() => lowerBound(y)(x)),
          E.isRight,
        ),
      ),
    }),
    unionType.of,
    (u) => pipe(
      u.value,
      O.liftPredicate((x): x is [Exclude<Type, UnionType>] => x.length === 1),
      O.map(A.headNonEmpty),
      O.getOrElse(() => u),
    ),
  ),
});

const targetLowerBound: TargetLowerBoundFunc<Type> = ({
  type,
  map,
}) => pipe(
  type.tag === 'generic' ? genericType.targetLowerBound(targetLowerBound)(map)(type)
  : type.tag === 'unknown' ? () => O.none
  : type.tag === 'unit' ? unitType.checkAssignability(type)
  : type.tag === 'simple' ? simpleType.checkAssignability(type)
  : type.tag === 'union' ? unionType.targetLowerBound(
    semigroup(targetLowerBound),
  )(targetLowerBound)(map)(type)
  : type.tag === 'tuple' ? tupleType.targetLowerBound(
    targetLowerBound,
  )(map)(type)
  : type.tag === 'record' ? recordType.targetLowerBound(
    targetLowerBound,
  )(map)(type)
  : type.tag === 'function' ? functionType.targetLowerBound(
    targetLowerBound,
  )(map)(type)
  : () => O.none,
);
