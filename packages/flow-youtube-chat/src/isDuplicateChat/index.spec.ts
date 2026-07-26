import {
  Option as O,
} from 'effect';
import {
  describe,
  expect,
  it,
} from 'vitest';

import chatDataFixture from '@/chatDataFixture';
import isDuplicateChat from '@/isDuplicateChat';

describe('isDuplicateChat', () => {
  it('matches on equal renderer ids regardless of other fields', () => {
    expect(isDuplicateChat(
      chatDataFixture({
        chatID: O.some('msg-1'),
        messageText: O.some('gg'),
      }),
      chatDataFixture({
        chatID: O.some('msg-1'),
        messageText: O.some('rendered differently'),
      }),
    )).toBe(true);
  });

  it('distinguishes look-alike messages by their ids', () => {
    const lookAlike = {
      authorID: O.none<string>(),
      messageText: O.some('gg'),
      timestamp: O.some('1:23 PM'),
    };

    expect(isDuplicateChat(
      chatDataFixture({
        ...lookAlike,
        chatID: O.some('msg-1'),
      }),
      chatDataFixture({
        ...lookAlike,
        chatID: O.some('msg-2'),
      }),
    )).toBe(false);
  });

  it('does not match an identified candidate against id-less state', () => {
    expect(isDuplicateChat(
      chatDataFixture({
        chatID: O.some('msg-1'),
      }),
      chatDataFixture({}),
    )).toBe(false);
  });

  it('falls back to the field heuristic for an id-less candidate', () => {
    const fields = {
      authorID: O.some('AuthorToken'),
      messageText: O.some('hello'),
      timestamp: O.some('1:23 PM'),
    };

    expect(isDuplicateChat(
      chatDataFixture(fields),
      chatDataFixture(fields),
    )).toBe(true);

    expect(isDuplicateChat(
      chatDataFixture(fields),
      chatDataFixture({
        ...fields,
        authorID: O.some('OtherToken'),
      }),
    )).toBe(false);
  });

  it('accepts the heuristic colliding on absent fields', () => {
    // Known limitation of the fallback: None equals None, so two id-less,
    // photo-less messages with the same text and displayed minute collide.
    // The id path above exists to make this case rare.
    const photoless = {
      messageText: O.some('gg'),
      timestamp: O.some('1:23 PM'),
    };

    expect(isDuplicateChat(chatDataFixture(photoless), chatDataFixture(photoless)))
      .toBe(true);
  });
});
