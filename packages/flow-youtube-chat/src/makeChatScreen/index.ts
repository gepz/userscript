import * as IO from 'fp-ts/IO';
import {
  pipe,
} from 'fp-ts/function';

export default pipe(
  () => document.createElement('div'),
  IO.chainFirst((x) => () => Object.assign<
  CSSStyleDeclaration,
  Partial<CSSStyleDeclaration>
  >(x.style, {
    pointerEvents: 'none',
    zIndex: '30',
    position: 'absolute',
    overflow: 'hidden',
    height: '100%',
    width: '100%',
  })),
);
