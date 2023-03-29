import {
  constant,
  flow,
} from '@effect/data/Function';
import * as O from '@effect/data/Option';
import * as Tu from '@effect/data/Tuple';
import * as En from 'fp-ts/Endomorphism';

type Editable<T> = readonly [
  T,
  O.Option<readonly [string, O.Option<string>]>,
];

export default Editable;

export const of: <T>(x: T) => Editable<T> = (x) => [x, O.none()];

export const fromValueText: <T>(v: T) => (t: string) => Editable<T> = (
  v,
) => (t) => [v, O.some([t, O.none()])];

export const value: <T>(x: Editable<T>) => T = Tu.getFirst;

export const text: <T>(x: Editable<T>) => O.Option<string> = flow(
  Tu.getSecond,
  O.map(Tu.getFirst),
);

export const error: <T>(x: Editable<T>) => O.Option<string> = flow(
  Tu.getSecond,
  O.flatMap(Tu.getSecond),
);

export const setValue: <T>(x: T) => En.Endomorphism<Editable<T>> = flow(
  constant,
  (x) => Tu.mapFirst(x),
);

export const setText: <T>(x: string) => En.Endomorphism<Editable<T>> = (
  x,
) => Tu.mapSecond(flow(
  O.map(Tu.mapFirst(constant(x))),
  O.orElse(constant(O.some<
  readonly [string, O.Option<string>]
  >([x, O.none()]))),
));

export const hasError = flow(
  error,
  O.isSome,
);
