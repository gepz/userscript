import * as O from 'fp-ts/Option';

import DisplayText from '@/DisplayText';

export default interface ChatData {
  chatType: 'normal' | 'membership' | 'ticker' | 'engagement',
  authorType: 'owner' | 'moderator' | 'member' | 'normal',
  authorID: O.Option<string>,
  authorName: O.Option<DisplayText>,
  messageElement: O.Option<Element>,
  message: O.Option<DisplayText>,
  messageText: O.Option<DisplayText>,
  paymentInfo: O.Option<DisplayText>,
  textColor: O.Option<string>,
  paidColor: O.Option<string>,
}
