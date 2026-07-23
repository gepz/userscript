import {
  Array as A,
  Option as O,
  pipe,
} from 'effect';

import ChatData from '@/ChatData';

// A bannedUsers row names one banned identity in up to two space-separated
// parts: an @handle (what live chat displays as the author name) and/or an
// avatar-URL token (the legacy authorID). Parts are matched independently,
// so a row keeps working when YouTube changes which identity the markup
// exposes — and legacy single-token rows are just the one-part case.

export const entryParts = (
  entry: string,
): readonly string[] => entry.split(' ').filter((part) => part !== '');

// The row the ban button writes: both identities when available, so the
// ban survives avatar changes (which rewrite the token) and any future
// reversal of handle display (which would retire the name part). A
// redemption's author is the gift's recipient, not someone who spoke, so
// it offers no entry — banning a user for being gifted would be wrong.
export const banEntryFor = (data: ChatData): O.Option<string> => pipe(
  A.getSomes([data.authorName, data.authorID]),
  O.liftPredicate(A.isNonEmptyReadonlyArray),
  O.filter(() => data.chatType !== 'giftRedemption'),
  O.map(A.join(' ')),
);

// Direct match: the author's handle or id equals a part of some row.
export const isBannedAuthor = (
  bannedUsers: readonly string[],
) => (data: ChatData): boolean => bannedUsers.some(
  (entry) => entryParts(entry).some(
    (part) => O.contains(data.authorID, part)
      || O.contains(data.authorName, part),
  ),
);
