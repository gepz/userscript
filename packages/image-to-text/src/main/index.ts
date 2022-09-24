import * as IO from 'fp-ts/IO';
import {
  pipe,
} from 'fp-ts/function';

export default pipe(
  () => {},
) satisfies IO.IO<void>;
