import * as O from 'effect/Option';

export default interface ChatData {
  chatType: 'normal' | 'membership' | 'ticker' | 'engagement',
  authorType: 'owner' | 'moderator' | 'member' | 'normal',
  authorID: O.Option<string>,
  authorName: O.Option<string>,
  timestamp: O.Option<string>,
  messageElement: O.Option<Element>,
  message: O.Option<string>,
  messageText: O.Option<string>,
  paymentInfo: O.Option<string>,
  textColor: O.Option<string>,
  paidColor: O.Option<string>,
}
