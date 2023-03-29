import * as O from '@effect/data/Option';
import * as R from 'fp-ts/Reader';
import {
  pipe,
  apply,
  constant,
} from '@effect/data/Function';
import * as Op from 'monocle-ts/Optional';

import Expression from '@/restrictedExpression/Expression';
import EditSetter from '@/ui/EditSetter';

export default <T>(
  setter: EditSetter<T>,
) => (
  opt: Op.Optional<Expression, T>,
) => (
  empty: T,
) => pipe(
  setter,
  R.map(R.map(
    (f) => (x: Expression) => pipe(
      opt.getOption(x),
      O.getOrElse(constant(empty)),
      f,
      opt.set,
      apply(x),
    ),
  )),
);
