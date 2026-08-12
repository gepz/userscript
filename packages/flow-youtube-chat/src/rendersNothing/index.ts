import {
  Option as O,
} from 'effect';

import ChatData from '@/ChatData';
import UserConfig from '@/UserConfig';

// Whether chatNode would render this chat as a blank span. The flow
// gates skip such chats — typically an emoji-only message under
// textOnly — which would otherwise flow invisibly while still taking a
// lane and a maxChatCount slot. consistency.spec.ts here enforces
// agreement with chatNode's rendered output.
export default (
  data: ChatData,
  config: Pick<
    UserConfig,
    'textOnly' | 'displayModName' | 'displaySuperChatAuthor'
  >,
): boolean => !(
  (O.isSome(data.authorName)
    && ((data.authorType === 'moderator' && config.displayModName)
      || (O.isSome(data.paymentInfo) && config.displaySuperChatAuthor)))
    || O.exists(data.paymentInfo, (x) => x.trim() !== '')
    || O.exists(data.messageText, (x) => x.trim() !== '')
    || (!config.textOnly && (O.exists(
      data.messageElement,
      (x) => x.querySelector('img') !== null,
    ) || O.isSome(data.stickerUrl)))
);
