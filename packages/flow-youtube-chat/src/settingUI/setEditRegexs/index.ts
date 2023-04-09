import {
  pipe,
  constant,
} from '@effect/data/Function';
import * as I from '@effect/data/Identity';
import * as O from '@effect/data/Option';
import * as P from '@effect/data/Predicate';
import * as RA from '@effect/data/ReadonlyArray';
import * as Str from '@effect/data/String';
import * as Tu from '@effect/data/Tuple';
import {
  intercalate,
} from '@effect/data/typeclass/Semigroup';
import Editable, * as Ed from '@userscript/ui/Editable';

export default (
  editing: boolean,
) => (
  value: string,
): (x: Editable<readonly string[]>) => Editable<readonly string[]> => pipe(
  value,
  Str.split(/\r\n|\n/),
  RA.filter(P.not(Str.isEmpty)),
  I.bindTo('regexs'),
  I.let('errors', ({
    regexs,
  }) => pipe(
    regexs,
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
    O.getOptionalMonoid<string>(
      intercalate('\n')(Str.Semigroup),
    ).combineAll,
  )),
  (ctx) => (
    editing ? Ed.setText(value)
    : pipe(
      ctx.errors,
      O.map((x) => Tu.mapSecond(() => O.some<
      readonly [string, O.Option<string>]
      >([value, O.some(x)]))),
      O.getOrElse(() => () => Ed.of(ctx.regexs)),
    )
  ),
);
