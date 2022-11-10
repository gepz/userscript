import * as En from 'fp-ts/Endomorphism';
import * as I from 'fp-ts/Identity';
import {
  concatAll,
} from 'fp-ts/Monoid';
import * as O from 'fp-ts/Option';
import * as P from 'fp-ts/Predicate';
import * as RA from 'fp-ts/ReadonlyArray';
import * as RTu from 'fp-ts/ReadonlyTuple';
import {
  pipe,
  constant,
} from 'fp-ts/function';
import * as Str from 'fp-ts/string';

import Editable, * as Ed from '@/ui/Editable';

export default (
  editing: boolean,
) => (
  value: string,
): En.Endomorphism<Editable<readonly string[]>> => pipe(
  value,
  Str.split(/\r\n|\n/),
  RA.filter(P.not(Str.isEmpty)),
  I.bindTo('regexs'),
  I.let('errors', ({
    regexs,
  }) => pipe(
    regexs,
    RA.mapWithIndex((i, x) => {
      try {
        RegExp(x, 'u');
        return O.none;
      } catch (e) {
        return O.of(
          // eslint-disable-next-line max-len
          // eslint-disable-next-line @typescript-eslint/restrict-template-expressions
          `${e} in regex number ${i}`,
        );
      }
    }),
    concatAll(O.getMonoid({
      concat(x, y) {
        return `${x}\n${y}`;
      },
    })),
  )),
  (ctx) => (
    editing ? Ed.setText(value)
    : pipe(
      ctx.errors,
      O.map((x) => RTu.mapSnd(() => O.of<
      readonly [string, O.Option<string>]
      >([value, O.of(x)]))),
      O.getOrElse<En.Endomorphism<Editable<readonly string[]>>>(
        constant(constant(Ed.of(ctx.regexs))),
      ),
    )
  ),
);
