import {
  Effect as Z,
  pipe,
} from 'effect';
import * as expEval from 'expression-eval';

import ChatData from '@/ChatData';
import UserConfig from '@/UserConfig';
import filterContext from '@/filter/filterContext';

export default (
  data: ChatData,
  config: UserConfig,
): Z.Effect<boolean> => pipe(
  Z.succeed(data),
  Z.filterOrFail(
    (x) => Boolean(expEval.eval(config.filterExp, filterContext(x))),
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
