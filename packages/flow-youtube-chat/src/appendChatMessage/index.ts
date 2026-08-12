import {
  Effect as Z,
} from 'effect';
import {
  flip,
} from 'effect/Function';

// Anchors the ban button inside a chat renderer. Safe even inside a
// message body the flow reads: chatNode's parseMessage renders a
// non-image element as its textContent, and the button contains only an
// svg, so it contributes an empty string to the flowing copy.
export default flip((
  chat: HTMLElement,
): (
  getEle: Z.Effect<HTMLElement>,
) => Z.Effect<void> => Z.flatMap(
  (x) => Z.sync(() => (chat.querySelector('#card, #header') === null
    ? chat.querySelector('#content #message')
    : chat.querySelector('yt-live-chat-author-chip')
      ?? chat.querySelector('#header-content-primary-column')
  )?.append(x)),
));
