import {
  Option as O,
} from 'effect';
import {
  describe,
  expect,
  it,
} from 'vitest';

import AuthorNameIndex, {
  emptyAuthorNames,
  isBannedByName,
  recordAuthor,
} from '@/AuthorNameIndex';
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

const author = (name: string, id: string): ChatData => chatData({
  authorID: O.some(id),
  authorName: O.some(name),
});

const observe = (...chats: readonly ChatData[]): AuthorNameIndex => chats
  .reduce((index, data) => recordAuthor(data)(index), emptyAuthorNames);

describe('recordAuthor', () => {
  it('accumulates ids per name and ignores partial identities', () => {
    const index = observe(
      author('Alice', 'id-1'),
      author('Alice', 'id-2'),
      author('Bob', 'id-3'),
      chatData({
        authorName: O.some('Nameless Id'),
      }),
      chatData({
        authorID: O.some('id-4'),
      }),
    );

    expect(index.get('Alice')).toEqual(new Set(['id-1', 'id-2']));
    expect(index.get('Bob')).toEqual(new Set(['id-3']));
    expect(index.size).toBe(2);
  });

  it('returns the same index for an already-known pair', () => {
    const index = observe(author('Alice', 'id-1'));

    expect(recordAuthor(author('Alice', 'id-1'))(index)).toBe(index);
  });
});

describe('isBannedByName', () => {
  const banned = isBannedByName(['id-1']);
  const idlessAlice = chatData({
    authorName: O.some('Alice'),
  });

  it('matches an id-less chat whose name maps to one banned id', () => {
    expect(banned(observe(author('Alice', 'id-1')))(idlessAlice)).toBe(true);
  });

  it('never matches a chat that carries an author id', () => {
    // Id matching is authoritative; the filter expression handles it.
    expect(banned(observe(author('Alice', 'id-1')))(
      author('Alice', 'id-9'),
    )).toBe(false);
  });

  it('does not match an unobserved or non-banned name', () => {
    expect(banned(emptyAuthorNames)(idlessAlice)).toBe(false);
    expect(banned(observe(author('Alice', 'id-2')))(idlessAlice)).toBe(false);
  });

  it('does not match a name shared by several observed ids', () => {
    expect(banned(observe(
      author('Alice', 'id-1'),
      author('Alice', 'id-2'),
    ))(idlessAlice)).toBe(false);
  });

  it('recognizes banned ids inside composite rows', () => {
    expect(isBannedByName(['@other id-1'])(observe(author('Alice', 'id-1')))(
      idlessAlice,
    )).toBe(true);
  });
});
