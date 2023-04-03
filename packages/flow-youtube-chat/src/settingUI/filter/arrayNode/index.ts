import {
  pipe,
  flow,
} from '@effect/data/Function';
import * as O from '@effect/data/Option';
import * as RA from '@effect/data/ReadonlyArray';
import {
  omit,
} from '@effect/data/Struct';
import {
  h,
  VNode,
} from 'hyperapp';

import * as EOP from '@/ElementOpticPair';
import SettingState from '@/SettingState';
import ArrayExpression from '@/settingUI/EditableExpression/ArrayExpression';
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
  RA.map((e, i) => (
    et: Type,
  ) => (
    m: GenericMap,
  ) => nodeF(et)(global)(m)(commander)(e)),
  RA.reduce(pipe(
    expectedType,
    RA.liftPredicate((x): x is TupleType => x.tag === 'tuple'),
    RA.map((x) => x.value),
    RA.filter(RA.isNonEmpty),
    RA.append<RA.NonEmptyReadonlyArray<Type | RestType>>(
      [restType.of(unknownType.unknown)] as const,
    ),
    RA.map((x): {
      types: (Type | ErrorType)[],
      nodes: VNode<SettingState>[],
      typeMap: GenericMap,
      expectedTupleTypes: RA.NonEmptyReadonlyArray<Type | RestType>,
    } => ({
      types: [],
      nodes: [],
      typeMap,
      expectedTupleTypes: x,
    })),
  ), (matches, elementFn) => pipe(
    matches,
    RA.flatMap((match) => pipe(
      match.expectedTupleTypes,
      RA.matchLeft(() => [5], (first, rest) => (first.tag === 'rest' ? ([
        first.value,
        [rest, match.expectedTupleTypes],
      ] as const) : ([first, [rest]] as const))),
      ([firstType, restTypesList]) => pipe(
        restTypesList,
        RA.filter(RA.isNonEmpty),
        RA.match(() => [], (() => flow(
          RA.map(pipe(
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
  RA.head,
  O.map(omit(['expectedTupleTypes'])),
  O.map((ctx) => pipe(
    ctx.types,
    O.liftPredicate(RA.every((x): x is Type => x.tag !== 'error')),
    O.match(() => errorType.error, tupleType.of),
    (type) => ({
      type,
      nodes: ctx.nodes,
      typeMap: updateTypeMap(expectedType)(type)(ctx.typeMap),
    }),
  )),
  O.getOrElse(() => errorResult(map)),
);
