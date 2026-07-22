import {
  Option as O,
} from 'effect';

import {
  entryParts,
} from '@/BanEntry';
import ChatData from '@/ChatData';

// Author display names are not unique on YouTube, so name-based banning is
// only safe while a name has been observed with exactly one author id in
// the current stream. This index records those observations; it must be
// reset on navigation (allStream's URL-change stream does).
type AuthorNameIndex = ReadonlyMap<string, ReadonlySet<string>>;

export default AuthorNameIndex;

export const emptyAuthorNames: AuthorNameIndex = new Map();

// Learns (name -> id) from chats carrying both; id-less chats teach
// nothing.
export const recordAuthor = (data: ChatData) => (
  index: AuthorNameIndex,
): AuthorNameIndex => {
  if (O.isNone(data.authorName) || O.isNone(data.authorID)) {
    return index;
  }

  const known = index.get(data.authorName.value);

  return known !== undefined && known.has(data.authorID.value)
    ? index
    : new Map(index).set(
      data.authorName.value,
      new Set(known ?? []).add(data.authorID.value),
    );
};

// Name matching is a fallback for chats that carry no author id (photo-less
// superchats and stickers): id matching is authoritative whenever an id
// exists. The name must map to exactly one observed id, and that id must be
// banned — a name shared by several chatters this stream matches nobody.
export const isBannedByName = (
  bannedUsers: readonly string[],
) => (index: AuthorNameIndex) => (data: ChatData): boolean => O.isNone(
  data.authorID,
) && O.exists(data.authorName, (name) => {
  const ids = index.get(name);

  return ids?.size === 1
    && [...ids].every((id) => bannedUsers.some(
      (entry) => entryParts(entry).includes(id),
    ));
});
