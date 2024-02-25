import {
  pipe,
  flow,
} from 'effect/Function';
import * as O from 'effect/Option';

import * as EOP from '@/ElementOpticPair';
import MemberExpression from '@/settingUI/editableExpression/MemberExpression';
import type NodeFunction from '@/settingUI/filter/NodeFunction';
import type * as nodeFunction from '@/settingUI/filter/NodeFunction';
import RecordType, * as recordType from '@/type/RecordType';

export default (
  f: NodeFunction,
): NodeFunction<MemberExpression> => ({
  expectedType,
  typeMap,
  commander,
}) => (pair) => pipe(
  f({
    expectedType: recordType.of({}),
    typeMap,
    commander,
  })(pipe(
    pair,
    EOP.prop('object'),
  )),
  O.liftPredicate(
    (x): x is nodeFunction.Result<RecordType> => x.type.tag === 'record',
  ),
  O.bindTo('objectResult'),
  O.let('propertyResult', (c) => makeNodeFunc(flow(
    chainNode(identifierNode)<
    never,
    Exclude<Expression, ArrayExpression | LiteralArray>
    >('Identifier'),
    chainNode(memberNode)('MemberExpression'),
    chainNode(callNode)('CallExpression'),
    chainNode(literalNode)('Literal'),
  ))({
    expectedType,
    typeMap,
    commander,
  })(
    pipe(
      pair,
      EOP.prop('property'),
    ),
  )),
  O.map((x) => f(expectedType)(x.type)(m)(c)(pipe(
    pair,
    EOP.prop('property'),
  ))),
  O.getOrElse(() => errorResult(m)),
);

