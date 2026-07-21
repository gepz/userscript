import Slot from '@/fixtureCapture/Slot';

const keepAttribute = new Set(['id', 'class']);

const authorToken: Partial<Record<Slot, string>> = {
  paidMessage: 'PlainToken456',
  paidSticker: 'StickerToken789',
  membershipItem: 'MemberToken321',
};

const fallbackAuthorName: Partial<Record<Slot, string>> = {
  paidMessage: 'Generous Viewer',
  paidSticker: 'Sticker Fan',
  membershipItem: 'New Member',
};

const messageText: Partial<Record<Slot, string>> = {
  ownerMessage: 'welcome',
  moderatorMessage: 'behave',
  memberMessage: 'hello',
  paidMessage: 'Great stream!',
  engagementMessage: 'Welcome to live chat!',
};

const timestampText: Partial<Record<Slot, string>> = {
  paidMessage: '1:24 PM',
  membershipItem: '1:25 PM',
};

const stripComments = (node: Node): void => {
  Array.from(node.childNodes).forEach((child) => {
    if (child.nodeType === Node.COMMENT_NODE) {
      child.remove();
    } else {
      stripComments(child);
    }
  });
};

/**
 * Anonymizes a captured live-chat element into a deterministic fixture
 * fragment: structure, tags, ids and classes stay verbatim from the page,
 * while every value the parseChat spec asserts on is rewritten to its
 * canonical fixture value. Contract details live in
 * src/parseChat/fixtures/README.md.
 *
 * Works on cross-realm elements (the chat iframe), so it never uses
 * instanceof and creates nodes through the element's own document.
 */
export default (slot: Slot, chat: HTMLElement): string => {
  // eslint-disable-next-line @typescript-eslint/consistent-type-assertions
  const root = chat.cloneNode(true) as HTMLElement;
  // Read before attribute stripping wipes it.
  const photoSrc = root.querySelector('#author-photo img')
    ?.getAttribute('src') ?? '';

  Array.from(root.querySelectorAll('script, style, link, iframe'))
    .forEach((element) => {
      element.remove();
    });

  stripComments(root);

  [root, ...Array.from(root.querySelectorAll('*'))].forEach((element) => {
    element.getAttributeNames()
      .filter((name) => !keepAttribute.has(name))
      .forEach((name) => {
        element.removeAttribute(name);
      });
  });

  const photo = root.querySelector('#author-photo img');

  if (photo) {
    const suffix = /^https:\/\/[^/]+\.ggpht\.com\/(?:ytc\/)?[^=]+(=.*)$/
      .exec(photoSrc)?.[1];

    // The ytc/ branch is forced per slot so both arms of parseChat's
    // authorID regex stay deterministically covered; an unrecognized URL is
    // replaced by a marker that makes the spec's authorID assertion fail,
    // surfacing the drift instead of hiding it.
    photo.setAttribute('src', suffix === undefined
      ? 'https://example.invalid/unrecognized-author-photo'
      : `https://yt4.ggpht.com/${slot === 'paidMessage' ? '' : 'ytc/'}${
        authorToken[slot] ?? 'AIdroFakeToken123'}${suffix}`);
  }

  const authorName = root.querySelector('#author-name');

  if (authorName) {
    authorName.textContent = root.querySelector('.owner')
      ? 'Streamer'
      : root.querySelector('.moderator')
        ? 'Mod'
        : fallbackAuthorName[slot]
          ?? (root.querySelector('.member') ? 'Member' : 'Regular Viewer');
  }

  const timestamp = root.querySelector('#timestamp');

  if (timestamp) {
    timestamp.textContent = timestampText[slot] ?? '1:23 PM';
  }

  const message = root.querySelector('#message');

  if (message) {
    message.textContent = '';

    if (slot === 'normalMessage') {
      const emoji = root.ownerDocument.createElement('img');
      emoji.setAttribute('class', 'emoji');
      emoji.setAttribute('alt', ':fish:');
      message.append('Hi ', emoji, ' chat');
    } else {
      message.append(messageText[slot] ?? 'hello');
    }
  }

  const amountSelector = slot === 'tickerPaidMessage'
    ? '#purchase-amount, #purchase-amount-chip, #content>#text'
    : '#purchase-amount, #purchase-amount-chip';

  const amount = slot === 'tickerPaidMessage'
    ? '$10.00'
    : slot === 'paidSticker' ? '¥200' : '$5.00';

  Array.from(root.querySelectorAll(amountSelector)).forEach((element) => {
    element.textContent = amount;
  });

  if (slot === 'paidMessage') {
    root.querySelector('#header')
      ?.setAttribute('style', 'background-color: rgb(0, 191, 165);');

    [root.querySelector('#card'), root.querySelector('#content')]
      .forEach((element) => element
        ?.setAttribute('style', 'background-color: rgb(29, 233, 182);'));
  }

  if (slot === 'paidSticker') {
    root.setAttribute('style', [
      '--yt-live-chat-paid-sticker-chip-background-color: rgb(0, 77, 64);',
      '--yt-live-chat-paid-sticker-background-color: rgb(0, 121, 107);',
    ].join(' '));
  }

  return root.outerHTML;
};
