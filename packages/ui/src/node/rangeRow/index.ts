import {
  constant,
  pipe,
  identity
} from 'effect/Function';
import * as O from 'effect/Option';
import {
  h,
  VNode,
  Action,
} from 'hyperapp';

import Editable, * as Ed from '@/Editable';
import RangeConfig from '@/node/RangeConfig';

export default <T>(
  config: RangeConfig,
  action: Partial<Record<
  'oninput'
  | 'onchange'
  , Action<T>
  >>,
) => (value: Editable<number>): VNode<T> => h('div', {}, [
  h('input', {
    style: {
      width: '150px',
      verticalAlign: 'middle',
    },
    type: 'range',
    ...config,
    value: Ed.value(value).toString(),
    oninput: action.onchange ?? identity,
  }),
  h('input', {
    style: {
      width: '30px',
      backgroundColor: 'transparent',
      color: 'inherit',
      borderWidth: '1px',
      verticalAlign: 'middle',
      borderColor: Ed.hasError(value) ? '#f55' : null,
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
