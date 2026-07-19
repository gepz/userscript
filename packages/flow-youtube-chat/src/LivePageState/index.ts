import {
  Effect as Z,
  Option as O,
  Record as R,
  Cause,
} from 'effect';

import LivePage from '@/LivePage';

interface LiveElementState<T> {
  ele: O.Option<T>
  read: Z.Effect<T, Cause.NoSuchElementException>
}

type LivePageState = {
  [P in keyof LivePage]: LivePage[P] extends Z.Effect<
    infer R2,
    Cause.NoSuchElementException
  > ? LiveElementState<R2> : never;
};

export default LivePageState;

// eslint-disable-next-line @typescript-eslint/consistent-type-assertions
export const makePageState = (p: LivePage): LivePageState => R.mapEntries(
  p,
  (v, k): [string, LiveElementState<Element>] => [
    k, {
      ele: O.none(),
      read: v,
    },
  ],
) as LivePageState;
