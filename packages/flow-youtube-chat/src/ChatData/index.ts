import {
  Option as O,
} from 'effect';

export default interface ChatData {
  chatType: 'normal' | 'membership' | 'giftPurchase' | 'giftRedemption'
    | 'engagement'
  // YouTube's per-message id from the renderer root: the stable identity
  // of one chat message, used for duplicate detection.
  chatID: O.Option<string>
  authorType: 'owner' | 'moderator' | 'member' | 'normal'
  authorID: O.Option<string>
  authorName: O.Option<string>
  timestamp: O.Option<string>
  messageElement: O.Option<Element>
  message: O.Option<string>
  messageText: O.Option<string>
  // Paid stickers only: the sticker art, which has no counterpart in the
  // message body (see stickerUrl).
  stickerUrl: O.Option<string>
  paymentInfo: O.Option<string>
  textColor: O.Option<string>
  paidColor: O.Option<string>
}
