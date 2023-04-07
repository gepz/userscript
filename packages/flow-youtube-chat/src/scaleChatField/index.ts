import {
  pipe,
} from '@effect/data/Function';
import * as O from '@effect/data/Option';
import * as RA from '@effect/data/ReadonlyArray';
import * as Z from '@effect/io/Effect';

import LivePageState from '@/LivePageState';

export default (
  live: LivePageState,
) => (
  scale: number,
): Z.Effect<never, never, void> => pipe(
  live.chatField.ele,
  Z.flatMap((field: HTMLElement) => pipe(
    [
      pipe(
        O.fromNullable(field.parentElement),
        O.map((x) => Z.sync(() => Object.assign<
        CSSStyleDeclaration,
        Partial<CSSStyleDeclaration>
        >(x.style, {
          transformOrigin: `${scale >= 1 ? 'top'
          : 'bottom'} left`,
          transform: `scale(${scale})`,
          width: `${100 / scale}%`,
          height: `${100 / scale}%`,
        }))),
      ),
      pipe(
        live.chatScroller.ele,
        O.map((scroller) => Z.sync(() => {
          // eslint-disable-next-line no-param-reassign
          scroller.scrollTop = scroller.scrollHeight;
        })),
      ),
    ],
    RA.compact,
    (x) => Z.all(x),
  )),
  Z.ignore,
);
