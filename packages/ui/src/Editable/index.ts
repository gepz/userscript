import {
  Option as O,
} from 'effect';
import {
  constant,
  pipe,
} from 'effect/Function';

// An invalid draft's payload: an optional message with detail beyond
// the field's own generic error text, which an invalid draft need not
// have (see setTextInvalid).
export type DraftError = O.Option<string>;

// A value bound to a text input: the committed value plus the user's
// in-progress draft text and its validation state. Tagged so runtime
// code can tell an Editable apart from plain user data without
// guessing from shape (see isEditable).
interface Editable<T> {
  readonly tag: 'Editable'
  readonly value: T
  readonly edit: O.Option<{
    readonly text: string
    // Present iff the draft is invalid.
    readonly error: O.Option<DraftError>
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
): O.Option<DraftError> => pipe(
  x.edit,
  O.flatMap((e) => e.error),
);

// Not for commit paths — committing a parsed draft goes through `of`,
// which deliberately drops the edit state.
export const map = <A, B>(
  f: (a: A) => B,
) => (e: Editable<A>): Editable<B> => ({
  ...e,
  value: f(e.value),
});

export const setValue = <T>(v: T): (e: Editable<T>) => Editable<T> => map(constant(v));

export const setText = (t: string) => <T>(e: Editable<T>): Editable<T> => ({
  ...e,
  edit: e.edit.pipe(
    O.map((x) => ({
      ...x,
      text: t,
    })),
    O.orElse(constant(O.some({
      text: t,
      error: O.none<DraftError>(),
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
