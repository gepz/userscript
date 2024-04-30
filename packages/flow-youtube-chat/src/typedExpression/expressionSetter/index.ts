import * as Op from '@fp-ts/optic';
import EditSetter from '@userscript/ui/setter/EditSetter';
import {
  pipe,
  apply,
} from 'effect/Function';
import {
  Option as O,
} from 'effect';


import TypedExpression from '@/typedExpression/typedExpression';

export default <T>(
  setter: EditSetter<T>,
) => (
  opt: Op.Optional<TypedExpression, T>,
) => (
  empty: T,
) => (
  editing: boolean,
) => (
  value: string,
) => (
  exp: TypedExpression,
) => pipe(
  Op.getOption(opt)(exp),
  O.getOrElse(() => empty),
  setter(editing)(value),
  Op.replace(opt),
  apply(exp),
);
