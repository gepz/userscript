import {
  Predicate as P,
} from 'effect';
import type jsep from 'jsep';

// Property names whose lookup would escape plain data into prototype or
// function internals. Rejected outright, even where they exist as own
// properties.
const forbiddenProperties: ReadonlySet<string> = new Set([
  '__proto__',
  'constructor',
  'prototype',
]);

// Own properties only: filter expressions may traverse the context record
// graph (operator library, message fields, arrays built inside the
// expression) but never the prototype chain, so no built-in method or
// intrinsic is reachable. Absent properties yield undefined, matching
// ordinary member-access semantics.
const memberValue = (object: unknown, property: unknown): unknown => {
  if (object === null || object === undefined) {
    throw new Error('Cannot read a property of null/undefined in a filter expression');
  }

  const key = typeof property === 'string'
    ? property
    : typeof property === 'number'
      ? String(property)
      : undefined;

  if (key === undefined) {
    throw new Error('Filter expression property names must be strings or numbers');
  }

  if (forbiddenProperties.has(key)) {
    throw new Error(`Property "${key}" is not allowed in filter expressions`);
  }

  // eslint-disable-next-line @typescript-eslint/consistent-type-assertions
  const record = object as Record<string, unknown>;

  return Object.hasOwn(record, key) ? record[key] : undefined;
};

const unaryOperations: Readonly<
  Record<string, ((x: unknown) => unknown) | undefined>
> = {
  '!': (x) => !P.isTruthy(x),
  '-': (x) => -Number(x),
  '+': (x) => Number(x),
};

// The casts intentionally reproduce JS operator coercion (e.g. `+` must still
// concatenate strings), so the type system is switched off for the operand
// positions only.
/* eslint-disable @typescript-eslint/consistent-type-assertions, eqeqeq */
const binaryOperations: Readonly<
  Record<string, ((l: unknown, r: unknown) => unknown) | undefined>
> = {
  '==': (l, r) => l == r,
  '!=': (l, r) => l != r,
  '===': (l, r) => l === r,
  '!==': (l, r) => l !== r,
  '<': (l, r) => (l as number) < (r as number),
  '>': (l, r) => (l as number) > (r as number),
  '<=': (l, r) => (l as number) <= (r as number),
  '>=': (l, r) => (l as number) >= (r as number),
  '+': (l, r) => (l as number) + (r as number),
  '-': (l, r) => (l as number) - (r as number),
  '*': (l, r) => (l as number) * (r as number),
  '/': (l, r) => (l as number) / (r as number),
  '%': (l, r) => (l as number) % (r as number),
};
/* eslint-enable @typescript-eslint/consistent-type-assertions, eqeqeq */

// Interprets a jsep AST against a fixed scope (see filterContext). Replaces
// expression-eval's evaluator; deliberately narrower than full JS: no
// prototype-chain access, no `this`, no bitwise operators, and identifiers
// must exist in the scope. Bad nodes throw rather than evaluating to
// something surprising.
const evaluateExpression = (
  context: Readonly<Record<string, unknown>>,
) => (
  expression: jsep.Expression,
): unknown => {
  const evaluate = evaluateExpression(context);
  // eslint-disable-next-line @typescript-eslint/consistent-type-assertions
  const exp = expression as jsep.CoreExpression;

  switch (exp.type) {
  case 'Literal':
    return exp.value;
  case 'Identifier': {
    if (!Object.hasOwn(context, exp.name)) {
      throw new Error(`Unknown identifier in filter expression: ${exp.name}`);
    }

    return context[exp.name];
  }

  case 'ArrayExpression':
    return exp.elements.map((x) => (x === null ? undefined : evaluate(x)));
  case 'MemberExpression': {
    const property = exp.computed
      ? evaluate(exp.property)
      // eslint-disable-next-line @typescript-eslint/consistent-type-assertions
      : (exp.property as jsep.Identifier).name;

    return memberValue(evaluate(exp.object), property);
  }

  case 'CallExpression': {
    const fn = evaluate(exp.callee);

    if (typeof fn !== 'function') {
      throw new Error('Filter expression tried to call a non-function');
    }

    // eslint-disable-next-line @typescript-eslint/consistent-type-assertions
    return (fn as (...args: readonly unknown[]) => unknown)(
      ...exp.arguments.map(evaluate),
    );
  }

  case 'UnaryExpression': {
    const operation = unaryOperations[exp.operator];

    if (operation === undefined) {
      throw new Error(`Unsupported unary operator: ${exp.operator}`);
    }

    return operation(evaluate(exp.argument));
  }

  case 'BinaryExpression': {
    const left = evaluate(exp.left);

    if (exp.operator === '||') {
      return P.isTruthy(left) ? left : evaluate(exp.right);
    }

    if (exp.operator === '&&') {
      return P.isTruthy(left) ? evaluate(exp.right) : left;
    }

    const operation = binaryOperations[exp.operator];

    if (operation === undefined) {
      throw new Error(`Unsupported binary operator: ${exp.operator}`);
    }

    return operation(left, evaluate(exp.right));
  }

  case 'ConditionalExpression':
    return P.isTruthy(evaluate(exp.test))
      ? evaluate(exp.consequent)
      : evaluate(exp.alternate);
  case 'Compound':
  case 'SequenceExpression': {
    const body = exp.type === 'Compound' ? exp.body : exp.expressions;

    return body.map(evaluate).at(-1);
  }

  default:
    throw new Error(`Unsupported expression type: ${expression.type}`);
  }
};

export default evaluateExpression;
