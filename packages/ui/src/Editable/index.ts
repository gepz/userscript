import {
  Option as O,
  Tuple as Tu,
} from 'effect';
import {
  constant,
  pipe,
} from 'effect/Function';

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

export const text = <T>(x: Editable<T>): O.Option<string> => pipe(
  Tu.getSecond(x),
  O.map(Tu.getFirst),
);

export const error = <T>(x: Editable<T>): O.Option<string> => pipe(
  Tu.getSecond(x),
  O.flatMap(Tu.getSecond),
);

export const setValue = <T>(v: T): (e: Editable<T>) => Editable<T> => pipe(
  constant(v),
  (x) => Tu.mapFirst(x),
);

export const setText: <T>(x: string) => (e: Editable<T>) => Editable<T> = (
  x,
) => Tu.mapSecond((snd) => snd.pipe(
  O.map(Tu.mapFirst(constant(x))),
  O.orElse(constant(O.some<
  readonly [string, O.Option<string>]
  >([x, O.none()]))),
));

export const hasError = <T>(x: Editable<T>) => O.isSome(error(x));
