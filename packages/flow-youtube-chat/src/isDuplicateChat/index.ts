import {
  Option as O,
} from 'effect';

import ChatData from '@/ChatData';
import strictOptionEquivalence from '@/strictOptionEquivalence';

// Whether candidate is a re-render of existing. The renderer id is
// YouTube's per-message identity, so an equal id means the page re-added
// the same message. Id-less markup (never seen in captures) falls back to
// a field heuristic, which can also false-positive on distinct look-alike
// messages — hence the id preference.
export default (candidate: ChatData, existing: ChatData): boolean => O.match(
  candidate.chatID,
  {
    onSome: (id) => O.contains(existing.chatID, id),
    onNone: () => strictOptionEquivalence(existing.authorID, candidate.authorID)
      && strictOptionEquivalence(existing.messageText, candidate.messageText)
      && strictOptionEquivalence(existing.timestamp, candidate.timestamp),
  },
);
