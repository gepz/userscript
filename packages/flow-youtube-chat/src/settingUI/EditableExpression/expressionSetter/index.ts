import EditSetter from '@userscript/ui/EditSetter';
import {
  pipe,
  apply,
  constant,
} from 'effect/Function';
import {
  Option as O,
} from 'effect';

import * as Op from 'monocle-ts/Optional';

import Expression from '@/settingUI/editableExpression/Expression';

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
