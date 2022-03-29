import * as IO from 'fp-ts/IO';
import * as O from 'fp-ts/Option';
import {
  pipe,
} from 'fp-ts/function';

export default (
  chatField: Element,
): IO.IO<void> => () => pipe(
  O.fromNullable(chatField.parentElement),
  O.map((x) => () => {
    // eslint-disable-next-line no-param-reassign
    x.style.overflow = 'unset';
  }),
);
