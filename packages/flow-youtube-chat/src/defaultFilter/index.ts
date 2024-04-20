import * as expEval from 'expression-eval';

import UserConfig from '@/UserConfig';

export default (
  config: UserConfig,
): expEval.parse.Expression => expEval.parse(`
or([
A.some(
  flip(flow([inText, A.some]))(${JSON.stringify(config.bannedWords)})
)(A.getSomes([
  messageText,
  paymentInfo
])),
A.some(
  flip(flow([matchedByText, A.some]))(${
  JSON.stringify(config.bannedWordRegexes)
})
)(A.getSomes([
  messageText,
  paymentInfo
])),
O.exists(
  flip(flow([eqText, A.some]))(${JSON.stringify(config.bannedUsers)})
)(authorID)
])
`);
