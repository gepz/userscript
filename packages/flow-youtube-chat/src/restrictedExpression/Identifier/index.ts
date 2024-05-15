import {
  pipe,
} from 'effect';
import * as expEval from 'expression-eval';

import TaggedValue, {
  makeType,
} from '@/TaggedValue';
import TypedIdentifier from '@/typedExpression/TypedIdentifier';

type Identifier = TaggedValue<'identifier', {
  name: string;
}>;

export const of = makeType<Identifier>('identifier');

export const fromJsExp = (exp: expEval.parse.Identifier): Identifier => of({
  name: exp.name,
});

export const toJsExp = ({
  value,
}: Identifier): expEval.parse.Identifier => ({
  type: 'Identifier',
  name: value.name,
});

export const fromTypedExp = ({
  value,
}: TypedIdentifier): Identifier => pipe(
  {
    name: value.name,
  },
  of,
);

export default Identifier;
