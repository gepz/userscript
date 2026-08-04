import {
  Effect as Z,
  Option as O,
  Array as A,
  pipe,
} from 'effect';

import ChatData from '@/ChatData';
import UserConfig from '@/UserConfig';
import evaluateExpression from '@/filter/evaluateExpression';
import filterContext from '@/filter/filterContext';

// True when the chat matches the user filter expression and must not flow.
// Suspended so an evaluator throw stays a fiber defect, not a sync throw at
// construction time.
export default (
  data: ChatData,
  config: UserConfig,
): Z.Effect<boolean> => Z.suspend(() => {
  const filtered = Boolean(
    evaluateExpression(filterContext(data))(config.filterExp),
  );

  if (!filtered) {
    return Z.succeed(false);
  }

  const detail = JSON.stringify(pipe(
    [data.message, data.paymentInfo],
    A.map(O.getOrElse(() => '')),
  ));

  return Z.as(Z.logDebug(`Filtered: ${detail}`), true);
});
