import * as E from '@effect/data/Either';
import {
  pipe,
  flow,
} from '@effect/data/Function';
import * as O from '@effect/data/Option';
import {
  generate,
} from 'astring';
import * as R from 'fp-ts/Reader';
import {
  Refinement,
} from 'fp-ts/Refinement';
import {
  VNode,
} from 'hyperapp';

import AppCommander from '@/AppCommander';
import ElementOpticPair, * as EOP from '@/ElementOpticPair';
import SettingState from '@/SettingState';
import Expression from '@/settingUI/EditableExpression/Expression';
// eslint-disable-next-line max-len
import editableExpressionToJsep from '@/settingUI/EditableExpression/editableExpressionToJsep';
import arrayNode from '@/settingUI/filter/arrayNode';
import callNode from '@/settingUI/filter/callNode';
import identifierNode from '@/settingUI/filter/identifierNode';
import literalArrayNode from '@/settingUI/filter/literalArrayNode';
import literalNode from '@/settingUI/filter/literalNode';
import memberNode from '@/settingUI/filter/memberNode';
import simplifyTypeForLog from '@/settingUI/filter/simplifyTypeForLog';
import ErrorType from '@/type/ErrorType';
import VarTypeMap from '@/type/GenericMap';
import Type from '@/type/Type';
import * as unknownType from '@/type/UnknownType';

import chainOptionElse from '@/chainOptionElse';

export type Context = {
  expectedType: Type,
  typeMap: VarTypeMap
  commander: AppCommander
};

export type Result = {
  type: Type | ErrorType,
  constrainedType: Type | ErrorType
  typeMap: VarTypeMap,
  nodes: readonly VNode<SettingState>[],
};

type NodeFunction<T extends Expression = Expression> = (c: Context) => (
  pair: ElementOpticPair<Expression, T>,
) => Result;

export default NodeFunction;

export const fromSwitcher = <T extends Expression>(
  switcher: (
    r: E.Either<never, ElementOpticPair<Expression, T>>
  ) => E.Right<ElementOpticPair<Expression, T>>
  | E.Left<R.Reader<
  NodeFunction,
  R.Reader<Context, Result>
  >>,
): NodeFunction<T> => (c) => (
  pair,
) => pipe(
  pair,
  (x) => (console.log(
    `${generate(editableExpressionToJsep(x.ele))}\n`,
    `${JSON.stringify(simplifyTypeForLog(c.expectedType), null, 2)}\n`,
    Object.keys(c.typeMap).length === 0 ? undefined : c.typeMap,
    // eslint-disable-next-line no-sequences
  ), x),
  E.right,
  switcher,
  // eslint-disable-next-line @typescript-eslint/no-use-before-define
  E.mapLeft((x) => x(expressionNode)(c)),
  E.map(() => ({
    type: unknownType.unknown,
    constrainedType: unknownType.unknown,
    typeMap: c.typeMap,
    nodes: [],
  })),
  E.merge,
  (x) => (console.log(
    `Return: ${generate(editableExpressionToJsep(pair.ele))}\n`,
    `${JSON.stringify(simplifyTypeForLog(x.type), null, 2)}\n`,
    Object.keys(x.typeMap).length === 0 ? undefined : x.typeMap,
  // eslint-disable-next-line no-sequences
  ), x),
);

const pairChainFilterMapElse = <T1 extends Expression, T2 extends T1, R>(
  f: R.Reader<ElementOpticPair<Expression, T2>, R>,
) => <E>(
  r: Refinement<T1, T2>,
) => chainOptionElse<ElementOpticPair<Expression, T1>, R, E>(flow(
  EOP.filter<Expression, T1, T2>(r),
  O.map(f),
));

const checkExpression = <T extends Expression>(
  type: T['type'],
) => (x: Expression): x is T => x.type === type;

const chainNode = <T2 extends Expression, R>(
  f: R.Reader<NodeFunction, R.Reader<
  Context,
  R.Reader<ElementOpticPair<Expression, T2>, R>
  >>,
) => <E, T1 extends Expression>(
  t: T2['type'],
) => pairChainFilterMapElse<T1 | T2, T2, R.Reader<
NodeFunction,
R.Reader<Context, R>
>>(
  (pair: ElementOpticPair<Expression, T2>) => (
    nf: NodeFunction,
  ) => (c: Context) => f(nf)(c)(pair),
)<E>(checkExpression(t));

export const expressionNode: NodeFunction = fromSwitcher(flow(
  chainNode(identifierNode)<never, Expression>('Identifier'),
  chainNode(memberNode)('MemberExpression'),
  chainNode(callNode)('CallExpression'),
  chainNode(literalNode)('Literal'),
  chainNode(literalArrayNode)('LiteralArray'),
  chainNode(arrayNode)('ArrayExpression'),
));
