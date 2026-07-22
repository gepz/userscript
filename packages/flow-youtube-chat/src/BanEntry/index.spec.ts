import {
  Option as O,
} from 'effect';
import {
  describe,
  expect,
  it,
} from 'vitest';

import {
  banEntryFor,
  entryParts,
  isBannedAuthor,
} from '@/BanEntry';
import ChatData from '@/ChatData';

const chatData = (overrides: Partial<ChatData>): ChatData => ({
  chatType: 'normal',
  chatID: O.none(),
  authorType: 'normal',
  authorID: O.none(),
  authorName: O.none(),
  timestamp: O.none(),
  messageElement: O.none(),
  message: O.none(),
  messageText: O.none(),
  paymentInfo: O.none(),
  textColor: O.none(),
  paidColor: O.none(),
  ...overrides,
});

describe('banEntryFor', () => {
  it('joins handle and token, handle first', () => {
    expect(banEntryFor(chatData({
      authorID: O.some('Token1'),
      authorName: O.some('@alice'),
    }))).toEqual(O.some('@alice Token1'));
  });

  it('degrades to the single available identity', () => {
    expect(banEntryFor(chatData({
      authorID: O.some('Token1'),
    }))).toEqual(O.some('Token1'));

    expect(banEntryFor(chatData({
      authorName: O.some('@alice'),
    }))).toEqual(O.some('@alice'));

    expect(banEntryFor(chatData({}))).toEqual(O.none());
  });
});

describe('isBannedAuthor', () => {
  const idlessAlice = chatData({
    authorName: O.some('@alice'),
  });

  const fullAlice = chatData({
    authorID: O.some('Token1'),
    authorName: O.some('@alice'),
  });

  it('matches a legacy token row against the author id', () => {
    expect(isBannedAuthor(['Token1'])(fullAlice)).toBe(true);
    expect(isBannedAuthor(['Token1'])(idlessAlice)).toBe(false);
  });

  it('matches a handle row against the author name', () => {
    expect(isBannedAuthor(['@alice'])(idlessAlice)).toBe(true);
    expect(isBannedAuthor(['@bob'])(idlessAlice)).toBe(false);
  });

  it('matches a composite row by either part', () => {
    const rows = ['@alice Token1'];

    expect(isBannedAuthor(rows)(idlessAlice)).toBe(true);
    expect(isBannedAuthor(rows)(chatData({
      // Avatar change rewrote the token-bearing markup? The handle part
      // still matches; and vice versa if handles stop being displayed.
      authorID: O.some('Token1'),
      authorName: O.some('@renamed'),
    }))).toBe(true);

    expect(isBannedAuthor(rows)(chatData({
      authorID: O.some('Token2'),
      authorName: O.some('@bob'),
    }))).toBe(false);
  });

  it('splits rows on spaces, ignoring extras', () => {
    expect(entryParts('  @alice   Token1 ')).toEqual(['@alice', 'Token1']);
  });
});
