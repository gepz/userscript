import {
  h,
  VNode,
  Action,
} from 'hyperapp';

export default <T>(
  min: number,
  max: number,
  step: number,
  value: string,
  editing: boolean,
  action: Partial<Record<
  'oninput'
  | 'onchange'
  | 'onfocus'
  | 'onblur'
  , Action<T>
  >>,
): VNode<T> => h('div', {}, [
  h('input', {
    style: {
      width: '150px',
      verticalAlign: 'middle',
    },
    type: 'range',
    min,
    max,
    step,
    value,
    oninput: action.onchange,
  }),
  h('input', {
    style: {
      width: '30px',
      backgroundColor: 'transparent',
      color: 'inherit',
      borderWidth: '1px',
      verticalAlign: 'middle',
    },
    inputmode: 'decimal',
    value: editing ? value
    : Number.parseFloat(value).toFixed(4).replace(/\.?0+$/, ''),
    ...action,
  }),
]);
