import * as Z from 'effect/Effect';
import {
  pipe,
} from 'effect/Function';

export default pipe(
  Z.sync(() => document.createElement('div')),
  Z.tap((x) => Z.sync(() => Object.assign<
  CSSStyleDeclaration,
  Partial<CSSStyleDeclaration>
  >(x.style, {
    pointerEvents: 'none',
    zIndex: '30',
    position: 'absolute',
    overflow: 'hidden',
    height: '100%',
    width: '100%',
  }))),
) satisfies Z.Effect<never, never, HTMLElement>;
