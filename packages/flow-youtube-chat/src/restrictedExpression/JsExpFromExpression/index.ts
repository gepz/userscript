import * as expEval from 'expression-eval';

import type Expression from '@/restrictedExpression/Expression';

type JsExpFromExpression = (x: Expression) => expEval.parse.Expression;

export default JsExpFromExpression;

