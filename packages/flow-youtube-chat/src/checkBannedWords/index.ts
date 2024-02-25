import * as Z from 'effect/Effect';
import {
  pipe,
} from 'effect/Function';
import * as O from 'effect/Option';
import * as RA from 'effect/ReadonlyArray';
import * as expEval from 'expression-eval';

import ChatData from '@/ChatData';
import UserConfig from '@/UserConfig';
import filterContext from '@/filter/filterContext';

export default (
  data: ChatData,
  config: UserConfig,
): Z.Effect<boolean> => pipe(
  data,
  O.liftPredicate(() => pipe(
    config.filterExp,
    // eslint-disable-next-line @typescript-eslint/consistent-type-assertions
    (x) => expEval.eval(
      x,
      filterContext(data),
    ) as boolean,
  )),
  O.map((d) => pipe(
    [
      d.message,
      d.paymentInfo,
    ],
    RA.map(O.map((x) => x.content)),
    RA.map(O.getOrElse(() => '')),
  )),
  O.map(JSON.stringify),
  Z.flatMap((x: string) => Z.logDebug(`Filtered: ${x}`)),
  Z.isSuccess,
);

