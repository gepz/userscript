import * as Op from '@fp-ts/optic';
import EditSetter from '@userscript/ui/setter/EditSetter';
import {
  pipe,
  apply,
} from 'effect/Function';
import * as O from 'effect/Option';

import Expression from '@/restrictedExpression/Expression';

export default <T>(
  setter: EditSetter<T>,
) => (
  opt: Op.Optional<Expression, T>,
) => (
  empty: T,
) => (
  editing: boolean,
) => (
  value: string,
) => (
  exp: Expression,
) => pipe(
  Op.getOption(opt)(exp),
  O.getOrElse(() => empty),
  setter(editing)(value),
  Op.replace(opt),
  apply(exp),
);
