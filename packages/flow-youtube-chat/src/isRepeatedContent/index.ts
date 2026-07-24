import {
  Option as O,
  pipe,
} from 'effect';

import ChatData from '@/ChatData';

// One message part: an emoji image contributes its channel-scoped emoji
// id (alt text as fallback, so a same-looking emoji still matches),
// wrapped so it cannot collide with literal text; anything else — text
// nodes, but also the appended fyc_button — contributes its textContent.
// The chat lives in the iframe realm, so instanceof needs its window.
const nodeKey = (node: Node): string => (
  node instanceof (node.ownerDocument?.defaultView ?? window).HTMLImageElement
    ? ` ${node.getAttribute('data-emoji-id')
    ?? node.getAttribute('alt')
    ?? node.src} `
    : node.textContent ?? '');

const contentKey = (data: ChatData): string => pipe(
  data.messageElement,
  O.map((x) => Array.from(x.childNodes).map(nodeKey).join('')),
  O.orElse(() => data.messageText),
  O.getOrElse(() => ''),
  (x) => x.trim(),
);

// The same-content test behind the noRepeatedContent option: whether
// candidate's visible message — text and emojis — repeats existing's,
// unlike isDuplicateChat, which detects re-renders of one message. A
// paid candidate never counts as a repeat, and a blank message never
// matches anything.
export default (
  candidate: ChatData,
  existing: ChatData,
): boolean => !O.exists(candidate.paymentInfo, (x) => x.trim() !== '')
  && pipe(
    contentKey(candidate),
    (x) => x !== '' && x === contentKey(existing),
  );
