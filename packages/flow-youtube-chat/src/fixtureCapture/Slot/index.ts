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

// Named type export (not default): node type stripping runs this module
// for importers of `slots` (the capture server), and a type has no runtime
// binding to be the default.
export type Slot = (typeof slots)[number];
