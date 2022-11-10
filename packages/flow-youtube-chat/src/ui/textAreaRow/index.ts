import * as O from 'fp-ts/Option';
import {
  constant,
  pipe,
} from 'fp-ts/function';
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
    resize: 'horizontal',
    boxSizing: 'border-box',
    width: '100%',
    borderColor: Ed.hasError(value) ? '#f55' : undefined,
  },
  value: pipe(
    value,
    Ed.text,
    O.getOrElse(pipe(
      Ed.value(value),
      (x) => x.join('\n'),
      constant,
    )),
  ),
  ...action,
});
