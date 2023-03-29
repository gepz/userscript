import {
  flow,
} from '@effect/data/Function';
import * as O from '@effect/data/Option';
import * as Z from '@effect/io/Effect';

export default <A, B>(
  f: (a: A) => O.Option<B>,
) => <R, E>(
  self: Z.Effect<R, E, A>,
): Z.Effect<R, O.Option<never> | E, B> => Z.flatMap(flow(
  f,
  Z.fromOption,
))(self);
