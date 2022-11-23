import * as O from 'fp-ts/Option';
import * as R from 'fp-ts/Reader';

import LivePage from '@/LivePage';
import mapObject from '@/mapObject';

type LiveElementState<T> = T extends () => infer R ? {
  ele: R,
  read: T,
} : never;

type LivePageState = {
  [P in keyof LivePage]: LiveElementState<LivePage[P]>;
};

export default LivePageState;

export const makePageState: R.Reader<LivePage, LivePageState> = mapObject(
  ([k, v]) => [
    k,
    {
      ele: O.none,
      read: v,
    },
  ],
);
