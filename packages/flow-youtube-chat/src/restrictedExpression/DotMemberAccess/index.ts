import * as E from 'effect/Either';
import {
  pipe,
} from 'effect/Function';
import * as expEval from 'expression-eval';

import type Expression from '@/restrictedExpression/Expression';
import ExpressionFromJsExp from '@/restrictedExpression/ExpressionFromJsExp';
// eslint-disable-next-line max-len
import ExpressionFromTypedExp from '@/restrictedExpression/ExpressionFromTypedExp';
import JsExpFromExpression from '@/restrictedExpression/JsExpFromExpression';
import TaggedValue, {
  makeType,
} from '@/TaggedValue';
import TypedDotMember from '@/typedExpression/TypedDotMember';

type DotMemberAccess = TaggedValue<'dotMemberAccess', {
  object: Expression;
  property: string;
}>;

export const of = makeType<DotMemberAccess>('dotMemberAccess');

export const fromJsExp = (
  exp: expEval.parse.MemberExpression,
) => (
  f: ExpressionFromJsExp,
) : E.Either<string, DotMemberAccess> => pipe(
  exp,
  E.liftPredicate(
    (x) => !x.computed,
    () => 'Computed member access is not supported',
  ),
  E.flatMap((x) => f(x.object)),
  E.bindTo('object'),
  E.apS('property', pipe(
    exp.property,
    E.liftPredicate(
      (x): x is expEval.parse.Identifier => x.type === 'Identifier',
      () => 'For the dot notation, the property name must be a JS identifier',
    ),
    E.map((x) => x.name),
  )),
  E.map(of),
);

export const toJsExp = ({
  value,
}: DotMemberAccess) => (
  f: JsExpFromExpression,
): expEval.parse.MemberExpression => ({
  type: 'MemberExpression',
  computed: false,
  object: f(value.object),
  // eslint-disable-next-line @typescript-eslint/consistent-type-assertions
  property: {
    type: 'Identifier',
    name: value.property,
  } satisfies expEval.parse.Identifier as expEval.parse.Expression,
});

export const fromTypedExp = ({
  value,
}: TypedDotMember) => (
  f: ExpressionFromTypedExp,
): DotMemberAccess => pipe(
  {
    object: f(value.object),
    property: value.property,
  },
  of,
);

export default DotMemberAccess;
