import {
  Option as O,
} from 'effect';
import {
  constant,
  pipe,
} from 'effect/Function';

// A value bound to a text input: the committed value plus the user's
// in-progress draft text and its validation state. Tagged so runtime
// code can tell an Editable apart from plain user data without
// guessing from shape (see isEditable).
interface Editable<T> {
  readonly tag: 'Editable'
  readonly value: T
  // error's outer Option marks the draft invalid; its inner Option is a
  // message with detail beyond the field's own generic error text, which
  // an invalid draft need not have (see errorText and setTextInvalid).
  readonly edit: O.Option<{
    readonly text: string
    readonly error: O.Option<O.Option<string>>
  }>
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
  edit: O.some({
    text: t,
    error: O.none(),
  }),
});

export const value = <T>(x: Editable<T>): T => x.value;

export const text = <T>(x: Editable<T>): O.Option<string> => pipe(
  x.edit,
  O.map((e) => e.text),
);

export const error = <T>(
  x: Editable<T>,
): O.Option<O.Option<string>> => pipe(
  x.edit,
  O.flatMap((e) => e.error),
);

export const setValue = <T>(v: T) => (e: Editable<T>): Editable<T> => ({
  ...e,
  value: v,
});

export const setText = (t: string) => <T>(e: Editable<T>): Editable<T> => ({
  ...e,
  edit: e.edit.pipe(
    O.map((x) => ({
      ...x,
      text: t,
    })),
    O.orElse(constant(O.some({
      text: t,
      error: O.none<O.Option<string>>(),
    }))),
  ),
});

export const setTextError = (
  t: string,
) => (
  err: string,
) => <T>(e: Editable<T>): Editable<T> => ({
  ...e,
  edit: O.some({
    text: t,
    error: O.some(O.some(err)),
  }),
});

// For drafts whose invalidity has no detail worth reporting beyond the
// field's own generic error text (e.g. a plain parse failure).
export const setTextInvalid = (
  t: string,
) => <T>(e: Editable<T>): Editable<T> => ({
  ...e,
  edit: O.some({
    text: t,
    error: O.some(O.none()),
  }),
});

export const hasError = <T>(x: Editable<T>) => O.isSome(error(x));
