import {
  Option as O,
  Array as A,
  Boolean as B,
  Predicate as P,
  String as Str,
} from 'effect';
import {
  flip,
  pipe,
} from 'effect/Function';

type PipeFns = Parameters<typeof pipe> extends [unknown, ...infer R]
  ? R
  : never;

const inText = (text: string) => (
  x: string,
): boolean => Str.includes(x)(text);

const eqText = (text: string) => (
  x: string,
): boolean => text === x;

const matchedByText = (text: string) => (
  x: string,
): boolean => P.isTruthy(text.match(RegExp(x, 'u')));

const filterOperators = {
  flip,
  flow: (fns: PipeFns) => (x: unknown) => pipe(x, ...fns),
  and: B.every,
  or: B.some,
  A: {
    some: A.some,
    getSomes: A.getSomes,
  },
  O: {
    exists: O.exists,
  },
  inText,
  eqText,
  matchedByText,
};

export default filterOperators;
