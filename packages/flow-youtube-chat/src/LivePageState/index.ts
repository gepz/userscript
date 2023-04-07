import * as O from '@effect/data/Option';
import * as Cause from '@effect/io/Cause';
import * as Z from '@effect/io/Effect';

import LivePage from '@/LivePage';
import mapObject from '@/mapObject';

type LiveElementState<T> = {
  ele: O.Option<T>,
  read: Z.Effect<never, Cause.NoSuchElementException, T>,
};

type LivePageState = {
  [P in keyof LivePage]: LivePage[P] extends Z.Effect<
  never,
  Cause.NoSuchElementException,
  infer R
  > ? LiveElementState<R> : never;
};

export default LivePageState;

export const makePageState: (p: LivePage) => LivePageState = mapObject(
  ([k, v]) => [
    k,
    {
      ele: O.none(),
      read: v,
    } satisfies LivePageState[typeof k],
  ],
);
