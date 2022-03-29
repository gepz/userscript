import * as expEval from 'expression-eval';

import UserConfigGetter from '@/UserConfigGetter';

export default (
  getConfig: UserConfigGetter,
): expEval.parse.Expression => expEval.parse(`
or([
RA.some(
  flip(flow([matchedByText, RA.some]))(${
  JSON.stringify(getConfig.bannedWordRegexs())
})
)(RA.compact([
  messageText,
  paymentInfo
])),
RA.some(
  flip(flow([inText, RA.some]))(${JSON.stringify(getConfig.bannedWords())})
)(RA.compact([
  messageText,
  paymentInfo
])),
O.exists(
  flip(flow([eqText, RA.some]))(${JSON.stringify(getConfig.bannedUsers())})
)(authorID)
])
`);
