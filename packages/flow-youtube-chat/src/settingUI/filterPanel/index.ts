import {
  pipe,
  flow,
  identity,
  compose,
} from 'effect/Function';
import * as O from 'effect/Option';
import * as RA from 'effect/ReadonlyArray';
import * as RR from 'effect/ReadonlyRecord';
import * as Tu from 'effect/Tuple';
import {
  VNode,
} from 'hyperapp';

import AppCommander from '@/AppCommander';
import * as EOP from '@/ElementOpticPair';
import SettingState from '@/SettingState';
import mapObject from '@/mapObject';
import setRecord from '@/setRecord';
import ErrorType from '@/type/ErrorType';
import FunctionType, * as functionType from '@/type/FunctionType';
import GenericMap from '@/type/GenericMap';
import RestType, * as restType from '@/type/RestType';
import SimpleType from '@/type/SimpleType';
import TupleType, * as tupleType from '@/type/TupleType';
import Type from '@/type/Type';
import UI from '@/type/UI';
import * as unknownType from '@/type/UnknownType';

const replaceVarType = (
  typeMap: GenericMap,
) => (
  type: Type,
): Type => pipe(
  replaceVarType(typeMap),
  (r) => (
    type.tag === 'var' && type.value in typeMap ? typeMap[`${type.value}`]
    : type.tag === 'func' ? pipe(
      {
        replacedMap: pipe(
          type.value[0][0].map,
          RR.filterWithIndex((k) => !(k in typeMap)),
        ),
        replacedParams: type.value[0],
      },
      ({
        replacedMap,
        replacedParams,
      }) => pipe(
        type.value[1],
        r,
        (returnType) => (returnType.tag === 'func' ? functionType.of([
          RA.appendAllNonEmpty(pipe(
            returnType.value[0],
            ([
              {
                type: firstType,
              },
              ...rest
            ]) => [
              {
                map: replacedMap,
                type: firstType,
              },
              ...rest,
            ],
          ))(replacedParams),
          returnType.value[1],
        ])
        : functionType.of([replacedParams, returnType])),
      ),
    )
    : type.tag === 'tuple' ? pipe(
      type.value,
      RA.map((x) => (x.tag === 'rest' ? restType.of(r(x.value))
      : r(x))),
      tupleType.of,
    )
    : type.tag === 'record' ? pipe(
      type.value,
      mapObject(([k, v]) => [k, r(v)]),
      recordType.of,
    )
    : type),
);

const assignableToFunc = (
  a: FunctionType,
) => (
  b: FunctionType,
): boolean => pipe(
  true,
);

const updateTypeMap = (
  expected: Type,
) => (
  actual: Type | ErrorType,
): (m: GenericMap) => GenericMap => (
  expected.tag === 'var'
  && actual.tag !== 'error'
  && actual.tag !== 'unknown'
  && actual.tag !== 'var' ? setRecord<number, Type>(
    expected.value,
  )(actual)
  : expected.tag === 'func' && actual.tag === expected.tag ? pipe(
    expected.value[0].length,
    (expectedParamCount) => (expectedParamCount < actual.value[0].length ? pipe(
      actual.value[0],
      RA.splitNonEmptyAt(expectedParamCount),
      ([a, b]) => pipe(
        RA.fromReadonlyArray(b),
        O.map((x) => functionType.of([
          x,
          actual.value[1],
        ])),
        O.map((x) => [a, x] as const),
      ),
    ) : O.some<
    readonly [RA.NonEmptyReadonlyArray<functionType.ParamType>, Type]
    >(actual.value)),
    O.map(Tu.mapFirst(RA.mapNonEmpty((x) => x.type))),
    O.map((a) => RA.zip(
      pipe(
        expected.value,
        Tu.mapFirst(RA.mapNonEmpty((x) => x.type)),
        (x) => [...x[0], x[1]],
      ),
      [...a[0], a[1]],
    )),
    O.map(RA.map(([e, a]) => updateTypeMap(e)(a))),
    O.map(RA.reduce(identity, (f, g) => compose(f, g))),
    O.getOrElse(() => identity),
  )
  : expected.tag === 'tuple' && actual.tag === expected.tag? pipe(
    RA.zip(expected.value, actual.)),
    O.getOrElse(() => identity),
  )
  : expected.tag === 'tuple' && actual.tag === expected.tag ? pipe(
    RA.zip(expected.value, actual.value),
    RA.takeWhile(
      (x): x is readonly [Type, Type] => x[0].tag !== 'rest'
      && x[1].tag !== 'rest',
    ),
    RA.map(([e, a]) => updateTypeMap(e)(a)),
    concatAll(En.getMonoid()),
  )
  : identity);

const primitiveTupleUI = (
  pri: Primitive,
): R.Reader<Type, O.Option<UI>> => flow(
  O.liftPredicate((x): x is TupleType => x.tag === 'tuple'),
  O.map((x) => x.value),
  O.filter((x): x is [RestType] => x.length === 1 && x[0].tag === 'rest'),
  O.map(([x]) => x.value),
  O.filter((x): x is SimpleType => x.tag === 'simple'),
  O.map((x) => x.value),
  O.filter((x) => x.pri === pri),
  O.map((x) => x.ui),
);

export default (
  commander: AppCommander,
) => (
  s: SettingState,
): readonly VNode<SettingState>[] => expNode({
  expectedType: unknownType.unknown,
  typeMap: {},
  commander,
})(EOP.of(s.filterExp)).nodes;
