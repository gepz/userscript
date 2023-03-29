import {
  pipe,
} from '@effect/data/Function';
import * as O from '@effect/data/Option';

import ChatData from '@/ChatData';
import filterOperators from '@/filter/filterOperators';

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
