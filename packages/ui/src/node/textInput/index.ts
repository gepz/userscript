import {
  Option as O,
} from 'effect';
import {
  constant,
  pipe,
} from 'effect/Function';
import {
  h,
  VNode,
  Action,
} from 'hyperapp';

import Editable, * as Ed from '@/Editable';

export default <T>(
  action: Partial<Record<
  'oninput'
  | 'onchange'
  , Action<T>
  >>,
) => (value: Editable<string>): VNode<T> => h('input', {
  style: {
    verticalAlign: 'middle',
    width: '5.5em',
    borderColor: Ed.hasError(value) ? '#f55' : null,
  },
  maxlength: 20,
  value: pipe(
    value,
    Ed.text,
    O.getOrElse(constant(Ed.value(value))),
  ),
  ...action,
});
