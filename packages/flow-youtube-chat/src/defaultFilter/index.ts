import * as expEval from 'expression-eval';

import UserConfig from '@/UserConfig';

export default (
  config: UserConfig,
): expEval.parse.Expression => expEval.parse(`
or([
RA.some(
  flip(flow([inText, RA.some]))(${JSON.stringify(config.bannedWords)})
)(RA.compact([
  messageText,
  paymentInfo
])),
RA.some(
  flip(flow([matchedByText, RA.some]))(${
  JSON.stringify(config.bannedWordRegexes)
})
)(RA.compact([
  messageText,
  paymentInfo
])),
O.exists(
  flip(flow([eqText, RA.some]))(${JSON.stringify(config.bannedUsers)})
)(authorID)
])
`);
