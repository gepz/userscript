import {
  concatAll,
} from 'fp-ts/Monoid';
import * as O from 'fp-ts/Option';
// import * as P from 'fp-ts/Predicate';
import * as RA from 'fp-ts/ReadonlyArray';
import * as B from 'fp-ts/boolean';
import {
  flow,
  flip,
} from 'fp-ts/function';
import * as Str from 'fp-ts/string';

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
  and: concatAll(B.MonoidAll),
  or: concatAll(B.MonoidAny),
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
