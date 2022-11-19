import * as expEval from 'expression-eval';
import * as O from 'fp-ts/Option';
import * as RA from 'fp-ts/ReadonlyArray';
import * as S from 'fp-ts/State';
import {
  pipe,
} from 'fp-ts/function';

import ChatData from '@/ChatData';
import UserConfigGetter from '@/UserConfigGetter';
import filterContext from '@/filter/filterContext';

export default (
  data: ChatData,
  getConfig: UserConfigGetter,
): S.State<unknown[], boolean> => pipe(
  data,
  O.fromPredicate(() => pipe(
    getConfig.filterExp(),
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
  O.map((x) => `Filtered: ${x}`),
  O.match<string, S.State<unknown[], boolean>>(
    () => S.of(false),
    (x) => (s) => [true, [...s, x]],
  ),
);
