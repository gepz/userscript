import {
  Option as O,
} from 'effect';

import ChatData from '@/ChatData';

// The same-content test behind the noRepeatedText option: whether
// candidate's visible message text repeats existing's — unlike
// isDuplicateChat, which detects re-renders of one message. A paid
// candidate never counts as a repeat, and blank text never matches
// anything: an emoji-only pair may differ by images the text cannot see.
export default (
  candidate: ChatData,
  existing: ChatData,
): boolean => !O.exists(candidate.paymentInfo, (x) => x.trim() !== '')
  && O.exists(candidate.messageText, (x) => x.trim() !== ''
    && O.exists(existing.messageText, (y) => y.trim() === x.trim()));
