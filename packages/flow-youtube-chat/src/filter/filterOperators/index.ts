import {
  MonoidEvery,
  MonoidSome,
} from '@effect/typeclass/data/Boolean';
import {
  Option as O,
  Array as A,
  Predicate as P,
  String as Str,
} from 'effect';
import {
  flip,
  pipe,
} from 'effect/Function';
import {
  Tail,
} from 'ts-toolbelt/out/List/Tail';

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
  flow: (fns: Tail<Parameters<typeof pipe>>) => (x: unknown) => pipe(x, ...fns),
  and: MonoidEvery.combineAll,
  or: MonoidSome.combineAll,
  RA: {
    some: A.some,
    getSomes: A.getSomes,
  },
  O: {
    exists: O.exists,
  },
  // allPreds: concatAll(P.getMonoidAll()),
  // anyPreds: concatAll(P.getMonoidAny()),
  inText,
  eqText,
  matchedByText,
};

export default filterOperators;
