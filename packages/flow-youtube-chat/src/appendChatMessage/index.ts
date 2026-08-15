import {
  Effect as Z,
} from 'effect';
import {
  flip,
} from 'effect/Function';

// Anchors an element inside a chat renderer, at the spot the site's
// banButtonAnchor picks. Safe even inside a message body the flow reads:
// chatNode's parseMessage renders a non-image element as its textContent,
// and the ban button contains only an svg, so it contributes an empty
// string to the flowing copy.
export default (
  anchorOf: (chat: HTMLElement) => Element | null,
) => flip((
  chat: HTMLElement,
): (
  getEle: Z.Effect<HTMLElement>,
) => Z.Effect<void> => Z.flatMap(
  (x) => Z.sync(() => anchorOf(chat)?.append(x)),
));
