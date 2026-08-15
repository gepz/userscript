import Site from '@/Site';
import livePageYt from '@/livePageYt';
import parseChat from '@/parseChat';
import setChatFieldSimplifyStyle from '@/setChatFieldSimplifyStyle';

export default ({
  // Broader than the @match header (www only) so a widened header does not
  // silently leave the page unadopted.
  matches: () => window.location.hostname.endsWith('youtube.com'),
  page: livePageYt,
  parseChat,
  // A card renderer (superchat, membership, gift) anchors in its header,
  // beside the author chip; a plain message has no header and anchors at
  // the end of its body.
  banButtonAnchor: (chat) => (chat.querySelector('#card, #header') === null
    ? chat.querySelector('#content #message')
    : chat.querySelector('yt-live-chat-author-chip')
      ?? chat.querySelector('#header-content-primary-column')),
  simplifyChat: setChatFieldSimplifyStyle,
  chatScrollerSelector: '#item-scroller',
}) satisfies Site;
