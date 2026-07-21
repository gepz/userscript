export const slots = [
  'normalMessage',
  'ownerMessage',
  'moderatorMessage',
  'memberMessage',
  'paidMessage',
  'paidSticker',
  'membershipItem',
  'tickerPaidMessage',
  'engagementMessage',
] as const;

type Slot = (typeof slots)[number];

export default Slot;
