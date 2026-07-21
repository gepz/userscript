// @vitest-environment happy-dom
import {
  Option as O,
} from 'effect';
import {
  describe,
  expect,
  it,
} from 'vitest';

import parseChat from '@/parseChat';
import {
  engagementMessage,
  membershipItem,
  memberMessage,
  moderatorMessage,
  normalMessage,
  ownerMessage,
  paidMessage,
  paidSticker,
  tickerPaidMessage,
} from '@/parseChat/fixtures';

// getComputedStyle only resolves styles for attached elements in happy-dom,
// so the fixture is mounted before parsing.
const parse = (html: string) => {
  const host = document.createElement('div');
  document.body.append(host);
  host.innerHTML = html;
  const chat = host.firstElementChild;

  if (!(chat instanceof HTMLElement)) {
    throw new Error('Fixture has no root element');
  }

  return parseChat(chat);
};

describe('parseChat', () => {
  it('parses a normal text message', () => {
    const data = parse(normalMessage);

    expect(data.chatType).toBe('normal');
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
    ['owner', ownerMessage],
    ['moderator', moderatorMessage],
    ['member', memberMessage],
  ] as const)('recognizes the %s author type', (authorType, fixture) => {
    expect(parse(fixture).authorType).toBe(authorType);
  });

  it('parses a paid message with payment info and card colors', () => {
    const data = parse(paidMessage);

    expect(data.chatType).toBe('normal');
    expect(data.authorID).toEqual(O.some('PlainToken456'));
    expect(data.paymentInfo).toEqual(O.some('$5.00'));
    expect(data.messageText).toEqual(O.some('Great stream!'));
    expect(data.textColor).toEqual(O.some('rgb(0, 191, 165)'));
    expect(data.paidColor).toEqual(O.some('rgb(29, 233, 182)'));
  });

  it('parses a paid sticker via its custom-property colors', () => {
    const data = parse(paidSticker);

    expect(data.chatType).toBe('normal');
    expect(data.paymentInfo).toEqual(O.some('¥200'));
    expect(data.messageText).toEqual(O.none());
    expect(data.textColor).toEqual(O.some('rgb(0, 77, 64)'));
    expect(data.paidColor).toEqual(O.some('rgb(0, 121, 107)'));
  });

  it('parses a membership item', () => {
    const data = parse(membershipItem);

    expect(data.chatType).toBe('membership');
    expect(data.authorType).toBe('member');
    expect(data.paymentInfo).toEqual(O.none());
    expect(data.messageText).toEqual(O.none());
  });

  it('parses a ticker item, taking payment info from #content>#text', () => {
    const data = parse(tickerPaidMessage);

    expect(data.chatType).toBe('ticker');
    expect(data.paymentInfo).toEqual(O.some('$10.00'));
    expect(data.textColor).toEqual(O.none());
    expect(data.paidColor).toEqual(O.none());
  });

  it('parses an engagement message without payment info', () => {
    const data = parse(engagementMessage);

    expect(data.chatType).toBe('engagement');
    expect(data.paymentInfo).toEqual(O.none());
    expect(data.messageText).toEqual(O.some('Welcome to live chat!'));
  });
});
