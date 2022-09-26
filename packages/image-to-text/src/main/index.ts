import * as IO from 'fp-ts/IO';
import * as O from 'fp-ts/Option';
import {
  pipe,
} from 'fp-ts/function';

import mainComponent from '@/mainComponent';
import simpleWrap from '@/simpleWrap';

export default pipe(
  simpleWrap(
    mainComponent,
    O.none,
  ),
  IO.chain((x) => () => document.body.append(x.node)),
) satisfies () => void;
