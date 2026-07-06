import {
  Effect as Z,
  pipe,
} from 'effect';

import ChatData from '@/ChatData';
import UserConfig from '@/UserConfig';
import evaluateExpression from '@/filter/evaluateExpression';
import filterContext from '@/filter/filterContext';

export default (
  data: ChatData,
  config: UserConfig,
): Z.Effect<boolean> => pipe(
  Z.succeed(data),
  Z.filterOrFail(
    (x) => Boolean(evaluateExpression(filterContext(x))(config.filterExp)),
  ),
  Z.map((x) => [
    x.message,
    x.paymentInfo,
  ]),
  Z.flatMap(Z.forEach(Z.orElse(() => Z.succeed('')))),
  Z.map(JSON.stringify),
  Z.flatMap((x: string) => Z.logDebug(`Filtered: ${x}`)),
  Z.isSuccess,
);
