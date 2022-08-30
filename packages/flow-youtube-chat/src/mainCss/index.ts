import * as IO from 'fp-ts/IO';
import {
  pipe,
} from 'fp-ts/function';

export default pipe(
  () => document.createElement('style'),
  IO.chainFirst((x) => () => {
    // eslint-disable-next-line no-param-reassign
    x.innerHTML = `.fyc_chat {
  line-height: 1;
  z-index: 30;
  position: absolute;
  user-select: none;
  white-space: nowrap;
  will-change: transform;
}
.fyc_button {
  display: inline-block;
  border-style: none;
  z-index: 4;
  font-weight: 500;
  color: var(--yt-spec-text-secondary);
}`;
  }),
) satisfies () => HTMLStyleElement;
