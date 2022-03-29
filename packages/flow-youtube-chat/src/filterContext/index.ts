import * as O from 'fp-ts/Option';
import {
  pipe,
} from 'fp-ts/function';

import ChatData from '@/ChatData';
import filterOperators from '@/filterOperators';

export default (
  data: ChatData,
) => ({
  ...filterOperators,
  authorName: data.authorName,
  message: data.message,
  messageText: data.messageText,
  paymentInfo: data.paymentInfo,
  authorID: pipe(
    data.authorID,
    O.map((x) => ({
      visible: false,
      content: x,
    })),
  ),
}) as const;
