import {
  Option as O,
} from 'effect';
import {
  constant,
  pipe,
} from 'effect/Function';

import Editable, * as Ed from '@/Editable';

export default <T>(subject: string) => (edit: Editable<T>): string => pipe(
  edit,
  Ed.error,
  O.map((x) => `${subject}${x === '' ? '' : ': '}${x}`),
  O.getOrElse(constant('')),
);
