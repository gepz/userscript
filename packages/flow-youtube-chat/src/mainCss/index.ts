import {
  Effect as Z,
  pipe,
} from 'effect';

export default pipe(
  Z.sync(() => document.createElement('style')),
  Z.tap((x) => Z.sync(() => {
    // eslint-disable-next-line no-param-reassign
    x.textContent = `.fyc_chat {
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
) satisfies Z.Effect<HTMLStyleElement>;
