import * as Z from 'effect/Effect';
import {
  pipe,
} from 'effect/Function';

export default pipe(
  Z.sync(() => document.createElement('style')),
  Z.tap((x) => Z.sync(() => {
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
  })),
) satisfies Z.Effect<never, never, HTMLStyleElement>;
