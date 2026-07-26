// @vitest-environment happy-dom
import {
  Option as O,
} from 'effect';
import {
  readFileSync,
} from 'node:fs';
import {
  describe,
  expect,
  it,
} from 'vitest';

import parseChat from '@/parseChat';

// Fragment provenance and refresh workflow: see fixtures/README.md.
// cwd-relative because import.meta.url is an http URL under happy-dom.
const fixture = (name: string): string => readFileSync(
  `src/parseChat/fixtures/${name}.html`,
  'utf8',
);

// getComputedStyle only resolves styles for attached elements in happy-dom,
// so the fixture is mounted before parsing.
const mount = (name: string): HTMLElement => {
  const host = document.createElement('div');
  document.body.append(host);
  host.innerHTML = fixture(name);
  const chat = host.firstElementChild;

  if (!(chat instanceof HTMLElement)) {
    throw new Error('Fixture has no root element');
  }

  return chat;
};

const parse = (name: string) => parseChat(mount(name));

describe('parseChat', () => {
  it('parses a normal text message', () => {
    const data = parse('normalMessage');

    expect(data.chatType).toBe('normal');
    expect(data.chatID).toEqual(O.some('FixtureChatID'));
    expect(data.authorType).toBe('normal');
    expect(data.authorID).toEqual(O.some('AIdroFakeToken123'));
    expect(data.authorName).toEqual(O.some('Regular Viewer'));
    expect(data.timestamp).toEqual(O.some('1:23 PM'));
    expect(data.messageText).toEqual(O.some('Hi  chat'));
    expect(O.exists(data.message, (x) => x.includes(':fish:'))).toBe(true);
    expect(data.paymentInfo).toEqual(O.none());
    expect(data.textColor).toEqual(O.none());
    expect(data.paidColor).toEqual(O.none());
  });

  it.each([
    ['owner', 'ownerMessage'],
    ['moderator', 'moderatorMessage'],
    ['member', 'memberMessage'],
  ] as const)('recognizes the %s author type', (authorType, name) => {
    expect(parse(name).authorType).toBe(authorType);
  });

  it('parses a paid message with payment info and card colors', () => {
    const data = parse('paidMessage');

    expect(data.chatType).toBe('normal');
    expect(data.chatID).toEqual(O.some('FixtureChatID'));
    // Real superchats occur both with and without #author-photo, and the
    // sanitizer keeps structure verbatim, so either variant may be the
    // captured fixture: authorID is the canonical token or nothing.
    expect([O.none(), O.some('PlainToken456')]).toContainEqual(data.authorID);
    expect(data.paymentInfo).toEqual(O.some('$5.00'));
    expect(data.messageText).toEqual(O.some('Great stream!'));
    expect(data.textColor).toEqual(O.some('rgb(0, 191, 165)'));
    expect(data.paidColor).toEqual(O.some('rgb(29, 233, 182)'));
  });

  it('parses a paid sticker via its custom-property colors', () => {
    const data = parse('paidSticker');

    expect(data.chatType).toBe('normal');
    expect(data.paymentInfo).toEqual(O.some('¥200'));
    expect(data.messageText).toEqual(O.none());
    expect(data.textColor).toEqual(O.some('rgb(0, 77, 64)'));
    expect(data.paidColor).toEqual(O.some('rgb(0, 121, 107)'));
    // Captured markup has only the placeholder GIF: the art lives in the
    // Polymer data, which no fixture can carry.
    expect(data.stickerUrl).toEqual(O.none());
  });

  it('takes the widest sticker image from the renderer data', () => {
    const chat = mount('paidSticker');

    Reflect.set(chat, 'data', {
      sticker: {
        thumbnails: [
          {
            url: '//lh3.googleusercontent.com/FixtureSticker=s104-rwa',
            width: 104,
          },
          {
            url: '//lh3.googleusercontent.com/FixtureSticker=s208-rwa',
            width: 208,
          },
        ],
      },
    });

    expect(parseChat(chat).stickerUrl).toEqual(O.some(
      'https://lh3.googleusercontent.com/FixtureSticker=s208-rwa',
    ));
  });

  it('has no sticker image on a chat that is not a sticker', () => {
    const chat = mount('paidMessage');

    Reflect.set(chat, 'data', {
      sticker: {
        thumbnails: [
          {
            url: '//lh3.googleusercontent.com/FixtureSticker=s208-rwa',
          },
        ],
      },
    });

    expect(parseChat(chat).stickerUrl).toEqual(O.none());
  });

  it('parses a membership item', () => {
    const data = parse('membershipItem');

    expect(data.chatType).toBe('membership');
    // Real membership renderers carry no .member badge class: authorType
    // reports the badge chips present in the markup, not the semantics of
    // the event (and membership items never become flow chats anyway).
    expect(data.authorType).toBe('normal');
    expect(data.paymentInfo).toEqual(O.none());
    // Milestone items carry a #message (canonicalized to 'hello');
    // new-member announcements have none. Either may be captured.
    expect([O.none(), O.some('hello')]).toContainEqual(data.messageText);
  });

  it('parses a gift purchase announcement', () => {
    const data = parse('giftPurchase');

    expect(data.chatType).toBe('giftPurchase');
    expect(data.chatID).toEqual(O.some('FixtureChatID'));
    expect(data.authorID).toEqual(O.none());
    expect(data.paymentInfo).toEqual(O.none());
    // The announcement inserts before its author chip stamps, so a capture
    // may carry the gifter's canonicalized name and badge or no author at
    // all; the flowed text comes from the live inner column either way.
    expect([O.none(), O.some('Gift Sender')]).toContainEqual(data.authorName);
    expect(['normal', 'member']).toContain(data.authorType);
    expect(O.exists(
      data.messageText,
      (x) => x.includes('Gifted 5 memberships'),
    )).toBe(true);
  });

  it('parses an engagement message without payment info', () => {
    const data = parse('engagementMessage');

    expect(data.chatType).toBe('engagement');
    expect(data.paymentInfo).toEqual(O.none());
    expect(data.messageText).toEqual(O.some('Welcome to live chat!'));
  });
});
