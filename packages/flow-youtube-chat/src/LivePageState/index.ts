import {
  Effect as Z,
  Option as O,
  Cause,
} from 'effect';

import LivePage from '@/LivePage';
import mapObject from '@/mapObject';

type LiveElementState<T> = {
  ele: O.Option<T>,
  read: Z.Effect<T, Cause.NoSuchElementException>,
};

type LivePageState = {
  [P in keyof LivePage]: LivePage[P] extends Z.Effect<
  infer R,
  Cause.NoSuchElementException
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
