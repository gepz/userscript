import {
  MonoidEvery,
  MonoidSome,
} from '@effect/typeclass/data/Boolean';
import {
  flip,
  pipe,
} from 'effect/Function';
import * as O from 'effect/Option';
import * as RA from 'effect/ReadonlyArray';
import * as Str from 'effect/String';
import {
  Tail,
} from 'ts-toolbelt/out/List/Tail';
// import * as P from 'effect/Predicate';

const inText = (text: string) => (
  x: string,
): boolean => Str.includes(x)(text);

const eqText = (text: string) => (
  x: string,
): boolean => text === x;

const matchedByText = (text: string) => (
  x: string,
): boolean => Boolean(text.match(RegExp(x, 'u')));

const filterOperators = {
  flip,
  flow: (fns: Tail<Parameters<typeof pipe>>) => (x: unknown) => pipe(x, ...fns),
  and: MonoidEvery.combineAll,
  or: MonoidSome.combineAll,
  RA: {
    some: RA.some,
    getSomes: RA.getSomes,
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
