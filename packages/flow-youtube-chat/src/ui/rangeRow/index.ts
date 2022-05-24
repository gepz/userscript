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
  min: number,
  max: number,
  step: number,
  action: Partial<Record<
  'oninput'
  | 'onchange'
  , Action<T>
  >>,
) => (value: Ed.Editable<number>): VNode<T> => h('div', {}, [
  h('input', {
    style: {
      width: '150px',
      verticalAlign: 'middle',
    },
    type: 'range',
    min,
    max,
    step,
    value: Ed.value(value).toString(),
    oninput: action.onchange,
  }),
  h('input', {
    style: {
      width: '30px',
      backgroundColor: 'transparent',
      color: 'inherit',
      borderWidth: '1px',
      verticalAlign: 'middle',
      borderColor: Ed.hasError(value) ? '#f55' : undefined,
    },
    inputmode: 'decimal',
    value: pipe(
      value,
      Ed.text,
      O.getOrElse(constant(
        Ed.value(value).toFixed(4).replace(/\.?0+$/, ''),
      )),
    ),
    ...action,
  }),
]);
