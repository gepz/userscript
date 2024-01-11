import {
  pipe,
} from 'effect/Function';
import * as O from 'effect/Option';
import * as P from 'effect/Predicate';
import * as RA from 'effect/ReadonlyArray';
import * as Str from 'effect/String';
import * as Tu from 'effect/Tuple';

import Editable, * as Ed from '@/Editable';
import EditSetter from '@/setter/EditSetter';

const setEditRegexes: EditSetter<Editable<readonly string[]>> = (
  editing,
) => (
  value,
) => pipe(
  value,
  Str.split(/\r\n|\n/),
  RA.filter(P.not(Str.isEmpty)),
  (regexes) => ({
    regexes,
    errors: pipe(
      regexes,
      RA.map((x, i) => {
        try {
          RegExp(x, 'u');
          return O.none();
        } catch (e) {
          return O.some(
            // eslint-disable-next-line max-len
            // eslint-disable-next-line @typescript-eslint/restrict-template-expressions
            `${e} in regex number ${i}`,
          );
        }
      }),
      RA.getSomes,
      RA.reduce('', (b, a) => `${b}\n${a}`),
      O.liftPredicate(Str.isNonEmpty),
    ),
  }),
  (ctx) => (
    editing ? Ed.setText(value)
    : pipe(
      ctx.errors,
      O.map((x) => Tu.mapSecond(() => O.some<
      readonly [string, O.Option<string>]
      >([value, O.some(x)]))),
      O.getOrElse(() => () => Ed.of(ctx.regexes)),
    )
  ),
);

export default setEditRegexes;
