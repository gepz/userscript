import * as expEval from 'expression-eval';
import * as IO from 'fp-ts/IO';
import * as O from 'fp-ts/Option';
import * as RA from 'fp-ts/ReadonlyArray';
import {
  pipe,
} from 'fp-ts/function';

import ChatData from '@/ChatData';
import Logger from '@/Logger';
import UserConfigGetter from '@/UserConfigGetter';
import defaultFilter from '@/defaultFilter';
import filterContext from '@/filterContext';

export default (
  data: ChatData,
  getConfig: UserConfigGetter,
  mainLog: Logger,
): boolean => pipe(
  data,
  O.fromPredicate(() => pipe(
    defaultFilter(getConfig),
    // getConfig.filterExp(),
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
  O.map((x) => mainLog([`Filtered: ${x}`])),
  O.match(
    () => () => false,
    IO.map(() => true),
  ),
)();
