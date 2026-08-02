import {
  Option as O,
  Tuple as Tu,
} from 'effect';
import {
  constant,
  pipe,
} from 'effect/Function';

// A value bound to a text input: the committed value plus the user's
// in-progress draft text and its validation error, if any. Tagged so
// runtime code can tell an Editable apart from plain user data without
// guessing from shape (see isEditable).
interface Editable<T> {
  readonly tag: 'Editable'
  readonly value: T
  readonly edit: O.Option<readonly [string, O.Option<string>]>
}

export default Editable;

export const isEditable = (x: unknown): x is Editable<unknown> => (
  typeof x === 'object'
  && x !== null
  && 'tag' in x
  && x.tag === 'Editable'
);

export const of = <T>(value: T): Editable<T> => ({
  tag: 'Editable',
  value,
  edit: O.none(),
});

export const fromValueText = <T>(v: T) => (t: string): Editable<T> => ({
  tag: 'Editable',
  value: v,
  edit: O.some([t, O.none()]),
});

export const value = <T>(x: Editable<T>): T => x.value;

export const text = <T>(x: Editable<T>): O.Option<string> => pipe(
  x.edit,
  O.map(Tu.getFirst),
);

export const error = <T>(x: Editable<T>): O.Option<string> => pipe(
  x.edit,
  O.flatMap(Tu.getSecond),
);

export const setValue = <T>(v: T) => (e: Editable<T>): Editable<T> => ({
  ...e,
  value: v,
});

export const setText = (t: string) => <T>(e: Editable<T>): Editable<T> => ({
  ...e,
  edit: e.edit.pipe(
    O.map(Tu.mapFirst(constant(t))),
    O.orElse(constant(O.some<
      readonly [string, O.Option<string>]
    >([t, O.none()]))),
  ),
});

export const setTextError = (
  t: string,
) => (
  err: string,
) => <T>(e: Editable<T>): Editable<T> => ({
  ...e,
  edit: O.some([t, O.some(err)]),
});

export const hasError = <T>(x: Editable<T>) => O.isSome(error(x));
