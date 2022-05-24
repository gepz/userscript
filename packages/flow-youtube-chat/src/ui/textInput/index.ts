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

import * as Ed from '@/ui/Editable';

export default <T>(
  action: Partial<Record<
  'oninput'
  | 'onchange'
  , Action<T>
  >>,
) => (value: Ed.Editable<string>): VNode<T> => h('input', {
  style: {
    verticalAlign: 'middle',
    width: '5.5em',
    borderColor: Ed.hasError(value) ? '#f55' : undefined,
  },
  maxlength: 20,
  value: pipe(
    value,
    Ed.text,
    O.getOrElse(constant(Ed.value(value))),
  ),
  ...action,
});
