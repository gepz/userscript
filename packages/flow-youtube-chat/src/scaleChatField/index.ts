import * as IO from 'fp-ts/IO';
import * as IOO from 'fp-ts/IOOption';
import * as O from 'fp-ts/Option';
import * as RA from 'fp-ts/ReadonlyArray';
import {
  pipe,
} from 'fp-ts/function';

import LivePageState from '@/LivePageState';

export default (live: LivePageState) => (scale: number): IO.IO<void> => pipe(
  live.chatField.ele,
  IOO.fromOption,
  IOO.chainIOK((field) => pipe(
    [
      pipe(
        O.fromNullable(field.parentElement),
        O.map((x) => () => Object.assign<
        CSSStyleDeclaration,
        Partial<CSSStyleDeclaration>
        >(x.style, {
          transformOrigin: `${scale >= 1 ? 'top'
          : 'bottom'} left`,
          transform: `scale(${scale})`,
          width: `${100 / scale}%`,
          height: `${100 / scale}%`,
        })),
      ),
      pipe(
        live.chatScroller.ele,
        O.map((scroller) => () => {
          // eslint-disable-next-line no-param-reassign
          scroller.scrollTop = scroller.scrollHeight;
        }),
      ),
    ],
    RA.compact,
    IO.sequenceArray,
  )),
);
