import {
  constant,
  pipe,
} from '@effect/data/Function';
import * as O from '@effect/data/Option';
import * as RA from '@effect/data/ReadonlyArray';
import {
  h,
  VNode,
  Action,
} from 'hyperapp';

import Editable, * as Ed from '@/ui/Editable';

export default <T>(
  rows: number,
  action: Partial<Record<
  'oninput'
  | 'onchange'
  , Action<T>
  >>,
) => (value: Editable<readonly string[]>): VNode<T> => h('textarea', {
  rows,
  style: {
    resize: 'none',
    boxSizing: 'border-box',
    width: '100%',
    borderColor: Ed.hasError(value) ? '#f55' : undefined,
  },
  value: pipe(
    value,
    Ed.text,
    O.getOrElse(pipe(
      Ed.value(value),
      RA.join('\n'),
      constant,
    )),
  ),
  ...action,
});
