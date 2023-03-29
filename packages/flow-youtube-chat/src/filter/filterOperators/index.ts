import {
  flow,
  flip,
} from '@effect/data/Function';
import * as O from '@effect/data/Option';
import * as RA from '@effect/data/ReadonlyArray';
import * as Str from '@effect/data/String';
import {
  booleanEvery,
  booleanSome,
} from '@effect/data/typeclass/Monoid';
// import * as P from '@effect/data/Predicate';

import DisplayText from '@/DisplayText';

const inText = (text: DisplayText) => (
  x: string,
): boolean => Str.includes(x)(text.content);

const eqText = (text: DisplayText) => (
  x: string,
): boolean => text.content === x;

const matchedByText = (text: DisplayText) => (
  x: string,
): boolean => Boolean(text.content.match(RegExp(x, 'u')));

const filterOperators = {
  flip,
  flow: (fns: Parameters<typeof flow>): (
  ...a: readonly unknown[]) => unknown => flow(...fns),
  and: booleanEvery.combineAll,
  or: booleanSome.combineAll,
  RA: {
    some: RA.some,
    compact: RA.compact,
  },
  O: {
    exists: O.exists,
  },
  // allPreds: concatAll(P.getMonoidAll()),
  // anyPreds: concatAll(P.getMonoidAny()),
  inText,
  eqText,
  matchedByText,
  isVisible: (x: DisplayText): boolean => x.visible,
};

export default filterOperators;
