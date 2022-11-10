import * as O from 'fp-ts/Option';
import * as RA from 'fp-ts/ReadonlyArray';
import {
  pipe,
} from 'fp-ts/function';

import LivePage from '@/LivePage';

type LiveElementState<T> = T extends () => infer R ? {
  ele: R,
  read: T,
} : never;

type LivePageState = {
  [P in keyof LivePage]: LiveElementState<LivePage[P]>;
};

export default LivePageState;

export const makePageState = (livePage: LivePage): LivePageState => pipe(
  // eslint-disable-next-line @typescript-eslint/consistent-type-assertions
  Object.keys(livePage) as (keyof LivePage)[],
  RA.map((x) => [
    x,
    {
      ele: O.none,
      read: livePage[x],
    },
  ]),
  Object.fromEntries,
);
