import {
  Option as O,
} from 'effect';
import jsep from 'jsep';
import {
  describe,
  expect,
  it,
} from 'vitest';

import ChatData from '@/ChatData';
import UserConfig from '@/UserConfig';
import defaultFilter from '@/defaultFilter';
import evaluateExpression from '@/filter/evaluateExpression';
import filterContext from '@/filter/filterContext';

const run = (
  context: Readonly<Record<string, unknown>>,
) => (source: string): unknown => evaluateExpression(context)(jsep(source));

describe('evaluateExpression', () => {
  it('evaluates literals and known identifiers', () => {
    const evaluate = run({
      x: 5,
    });

    expect(evaluate('42')).toBe(42);
    expect(evaluate('"a"')).toBe('a');
    expect(evaluate('x')).toBe(5);
  });

  it('throws on unknown identifiers', () => {
    expect(() => run({})('nope')).toThrow(/Unknown identifier/);
  });

  it('reads own properties only, absent ones as undefined', () => {
    const evaluate = run({
      o: {
        a: 1,
      },
      arr: ['a', 'b'],
    });

    expect(evaluate('o.a')).toBe(1);
    expect(evaluate('o.missing')).toBe(undefined);
    expect(evaluate('o.toString')).toBe(undefined);
    expect(evaluate('arr[1]')).toBe('b');
    // length is an own property of arrays, so it stays reachable.
    expect(evaluate('arr.length')).toBe(2);
  });

  it('rejects prototype-escape properties and bad member access', () => {
    const evaluate = run({
      o: {},
      n: null,
    });

    expect(() => evaluate('o["__proto__"]')).toThrow(/not allowed/);
    expect(() => evaluate('o.constructor')).toThrow(/not allowed/);
    expect(() => evaluate('o.prototype')).toThrow(/not allowed/);
    expect(() => evaluate('n.a')).toThrow(/null\/undefined/);
    expect(() => evaluate('o[[1]]')).toThrow(/strings or numbers/);
  });

  it('calls functions from the scope and rejects non-functions', () => {
    const evaluate = run({
      add: (l: number, r: number) => l + r,
      n: 3,
    });

    expect(evaluate('add(1, 2)')).toBe(3);
    expect(() => evaluate('n(1)')).toThrow(/non-function/);
  });

  it('supports the unary operator subset', () => {
    const evaluate = run({});

    expect(evaluate('!0')).toBe(true);
    expect(evaluate('-"5"')).toBe(-5);
    expect(evaluate('+"5"')).toBe(5);
    expect(() => evaluate('~1')).toThrow(/Unsupported unary/);
  });

  it('supports the binary operator subset with JS coercion', () => {
    const evaluate = run({});

    expect(evaluate('"a" + "b"')).toBe('ab');
    expect(evaluate('"2" == 2')).toBe(true);
    expect(evaluate('"2" === 2')).toBe(false);
    expect(evaluate('7 % 4')).toBe(3);
    expect(() => evaluate('1 | 2')).toThrow(/Unsupported binary/);
  });

  it('short-circuits && and || without evaluating the right side', () => {
    const evaluate = run({});

    expect(evaluate('true || nope')).toBe(true);
    expect(evaluate('false && nope')).toBe(false);
    expect(evaluate('0 || "x"')).toBe('x');
    expect(evaluate('"" && "x"')).toBe('');
  });

  it('evaluates conditionals lazily', () => {
    expect(run({})('1 ? "y" : nope')).toBe('y');
  });

  it('evaluates arrays, holes becoming undefined', () => {
    const evaluate = run({});

    expect(evaluate('[1, "a"]')).toEqual([1, 'a']);
    expect(evaluate('[1,,2]')).toEqual([1, undefined, 2]);
  });

  it('evaluates compounds to their last expression', () => {
    expect(run({})('1; 2')).toBe(2);
  });

  it('throws on unsupported node types', () => {
    expect(() => run({})('this')).toThrow(/Unsupported expression type/);
  });
});

describe('defaultFilter end to end', () => {
  // Only the three banned-* keys feed defaultFilter; the cast spares the
  // spec a full UserConfig fixture.
  // eslint-disable-next-line @typescript-eslint/consistent-type-assertions
  const config = {
    bannedWords: ['spam'],
    bannedWordRegexes: ['^\\d+$'],
    bannedUsers: ['BadActor'],
  } as UserConfig;

  const chatData = (overrides: Partial<ChatData>): ChatData => ({
    chatType: 'normal',
    authorType: 'normal',
    authorID: O.none(),
    authorName: O.none(),
    timestamp: O.none(),
    messageElement: O.none(),
    message: O.none(),
    messageText: O.none(),
    paymentInfo: O.none(),
    textColor: O.none(),
    paidColor: O.none(),
    ...overrides,
  });

  const filtered = (overrides: Partial<ChatData>): unknown => (
    evaluateExpression(filterContext(chatData(overrides)))(
      defaultFilter(config),
    ));

  it.each([
    [
      true, 'a banned word in the message', {
        messageText: O.some('buy spam now'),
      },
    ],
    [
      true, 'a banned word in the payment info', {
        paymentInfo: O.some('spam!'),
      },
    ],
    [
      true, 'a banned regex match', {
        messageText: O.some('12345'),
      },
    ],
    [
      true, 'a banned author', {
        authorID: O.some('BadActor'),
      },
    ],
    [
      false, 'a clean message', {
        messageText: O.some('hello there'),
        authorID: O.some('GoodActor'),
      },
    ],
    [false, 'an empty chat', {}],
  ] as const)('returns %s for %s', (expected, label, overrides) => {
    expect(filtered(overrides)).toBe(expected);
  });
});
