import {
  pipe,
} from '@effect/data/Function';
import * as O from '@effect/data/Option';
import * as RA from '@effect/data/ReadonlyArray';
import * as Z from '@effect/io/Effect';
import * as expEval from 'expression-eval';

import ChatData from '@/ChatData';
import UserConfig from '@/UserConfig';
import filterContext from '@/filter/filterContext';

export default (
  data: ChatData,
  config: UserConfig,
): Z.Effect<never, never, boolean> => pipe(
  data,
  O.liftPredicate(() => pipe(
    config.filterExp,
    // eslint-disable-next-line @typescript-eslint/consistent-type-assertions
    (x) => expEval.eval(
      x,
      filterContext(data),
    ) as boolean,
  )),
  O.map((x) => [
    pipe(
      x.message,
      O.map((m) => m.content),
    ),
    pipe(
      x.paymentInfo,
      O.map((p) => p.content),
    ),
  ]),
  O.map(RA.map(O.getOrElse(() => ''))),
  O.map(JSON.stringify),
  Z.fromOption,
  Z.flatMap((x) => Z.logDebug(`Filtered: ${x}`)),
  Z.isSuccess,
);
