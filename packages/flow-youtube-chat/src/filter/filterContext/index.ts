import ChatData from '@/ChatData';
import filterOperators from '@/filter/filterOperators';

export default (
  data: ChatData,
) => (({
  ...filterOperators,
  authorName: data.authorName,
  message: data.message,
  messageText: data.messageText,
  paymentInfo: data.paymentInfo,
  authorID: data.authorID,
}) as const);
