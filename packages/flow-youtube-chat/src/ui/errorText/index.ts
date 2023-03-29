import * as O from '@effect/data/Option';
import {
  constant,
  pipe,
} from '@effect/data/Function';

import Editable, * as Ed from '@/ui/Editable';

export default <T>(subject: string) => (edit: Editable<T>): string => pipe(
  edit,
  Ed.error,
  O.map((x) => `${subject}${x === '' ? '' : ': '}${x}`),
  O.getOrElse(constant('')),
);
