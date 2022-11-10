import * as En from 'fp-ts/Endomorphism';
import * as O from 'fp-ts/Option';
import * as RTu from 'fp-ts/ReadonlyTuple';
import {
  constant,
  flow,
} from 'fp-ts/function';

type Editable<T> = readonly [
  T,
  O.Option<readonly [string, O.Option<string>]>,
];

export default Editable;

export const of: <T>(x: T) => Editable<T> = (x) => [x, O.none];

export const fromValueText: <T>(v: T) => (t: string) => Editable<T> = (
  v,
) => (t) => [v, O.of([t, O.none])];

export const value: <T>(x: Editable<T>) => T = RTu.fst;

export const text: <T>(x: Editable<T>) => O.Option<string> = flow(
  RTu.snd,
  O.map(RTu.fst),
);

export const error: <T>(x: Editable<T>) => O.Option<string> = flow(
  RTu.snd,
  O.chain(RTu.snd),
);

export const setValue: <T>(x: T) => En.Endomorphism<Editable<T>> = flow(
  constant,
  RTu.mapFst,
);

export const setText: <T>(x: string) => En.Endomorphism<Editable<T>> = (
  x,
) => RTu.mapSnd(flow(
  O.map(RTu.mapFst(constant(x))),
  O.alt(constant(O.of<
  readonly [string, O.Option<string>]
  >([x, O.none]))),
));

export const hasError = flow(
  error,
  O.isSome,
);
