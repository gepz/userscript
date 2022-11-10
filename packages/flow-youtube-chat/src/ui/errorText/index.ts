import * as O from 'fp-ts/Option';
import {
  constant,
  pipe,
} from 'fp-ts/function';

import Editable, * as Ed from '@/ui/Editable';

export default <T>(subject: string) => (edit: Editable<T>): string => pipe(
  edit,
  Ed.error,
  O.map((x) => `${subject}${x === '' ? '' : ': '}${x}`),
  O.getOrElse(constant('')),
);
