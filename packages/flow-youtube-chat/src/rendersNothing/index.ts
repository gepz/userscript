import {
  Option as O,
} from 'effect';

import ChatData from '@/ChatData';
import UserConfig from '@/UserConfig';

// Whether chatNode would render this chat as a blank span — nothing from
// any of its three parts: the author line (shown only for a moderator
// with displayModName, or a payer with displaySuperChatAuthor), the
// payment info, and the message body, whose images count only when
// textOnly is off (textContent already excludes them). The flow gates
// skip such chats: the typical case is an emoji-only message under
// textOnly, which would otherwise flow invisibly while still taking a
// lane and a maxChatCount slot. Keep in sync with chatNode.
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
    || (!config.textOnly && O.exists(
      data.messageElement,
      (x) => x.querySelector('img') !== null,
    ))
);
