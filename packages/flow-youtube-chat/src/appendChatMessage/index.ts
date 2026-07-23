import {
  Effect as Z,
} from 'effect';
import {
  flip,
} from 'effect/Function';

// Anchors the ban button inside a chat renderer. Plain messages carry it
// at the end of the message body; renderers built around a card or
// header (superchats, paid stickers, membership items, gift
// announcements) have no reliably visible body, so there it rides inside
// the author-name chip — matched as an element, since only the paid
// renderers give the chip its #author-name-chip id — or failing that
// (gift announcements have no chip) at the end of the header's text
// column. Both are always on screen. Safe even inside a message body the
// flow reads: chatNode's parseMessage renders only image and text nodes,
// so a button never reaches the flowing copy.
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
