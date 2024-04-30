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
  omit,
} from 'effect/Struct';
import {
  h,
  VNode,
} from 'hyperapp';

import * as EOP from '@/ElementOpticPair';
import SettingState from '@/SettingState';
import ArrayExpression from '@/settingUI/editableExpression/ArrayExpression';
import type NodeFunction from '@/settingUI/filter/NodeFunction';
import errorResult from '@/settingUI/filter/errorResult';
import ErrorType from '@/type/ErrorType';
import * as errorType from '@/type/ErrorType';
import GenericMap from '@/type/GenericMap';
import RestType, * as restType from '@/type/RestType';
import TupleType, * as tupleType from '@/type/TupleType';
import Type from '@/type/Type';
import * as unknownType from '@/type/UnknownType';

export default (
  nodeF: NodeFunction,
): NodeFunction<ArrayExpression> => ({
  expectedType,
  typeMap,
  commander,
}) => (pair) => pipe(
  pair,
  EOP.prop('elements'),
  EOP.toArray,
  A.map((e, i) => (
    et: Type,
  ) => (
    m: GenericMap,
  ) => nodeF(et)(global)(m)(commander)(e)),
  A.reduce(pipe(
    expectedType,
    A.liftPredicate((x): x is TupleType => x.tag === 'tuple'),
    A.map((x) => x.value),
    A.filter(A.isNonEmptyArray),
    A.append<A.NonEmptyReadonlyArray<Type | RestType>>(
      [restType.of(unknownType.unknown)] as const,
    ),
    A.map((x): {
      types: (Type | ErrorType)[],
      nodes: VNode<SettingState>[],
      typeMap: GenericMap,
      expectedTupleTypes: A.NonEmptyReadonlyArray<Type | RestType>,
    } => ({
      types: [],
      nodes: [],
      typeMap,
      expectedTupleTypes: x,
    })),
  ), (matches, elementFn) => pipe(
    matches,
    A.flatMap((match) => pipe(
      match.expectedTupleTypes,
      A.matchLeft(() => [5], (first, rest) => (first.tag === 'rest' ? ([
        first.value,
        [rest, match.expectedTupleTypes],
      ] as const) : ([first, [rest]] as const))),
      ([firstType, restTypesList]) => pipe(
        restTypesList,
        A.filter(A.isNonEmptyArray),
        A.match(() => [], (() => flow(
          A.map(pipe(
            elementFn(replaceVarType(match.typeMap)(firstType))(match.typeMap),
            (x) => (restTypes) => ({
              types: [...match.types, x.type],
              nodes: [...match.nodes, h('div', {}, x.nodes)],
              typeMap: x.typeMap,
              expectedTupleTypes: restTypes,
            }),
          )),
        ))()),
      ),
    )),
  )),
  A.head,
  O.map(omit(['expectedTupleTypes'])),
  O.map((ctx) => pipe(
    ctx.types,
    O.liftPredicate(A.every((x): x is Type => x.tag !== 'error')),
    O.match({
      onNone: () => errorType.error,
      onSome: tupleType.of,
    }),
    (type) => ({
      type,
      nodes: ctx.nodes,
      typeMap: updateTypeMap(expectedType)(type)(ctx.typeMap),
    }),
  )),
  O.getOrElse(() => errorResult(map)),
);
