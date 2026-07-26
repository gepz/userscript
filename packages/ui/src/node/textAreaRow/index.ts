import {
  Array as A,
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
  rows: number,
  action: Partial<Record<
    'oninput'
    | 'onchange',
    Action<T>
  >>,
) => (value: Editable<readonly string[]>): VNode<T> => h('textarea', {
  rows,
  // One entry per line: soft wrap would fold a long entry (a "handle
  // token" ban row, a long regex) into what looks like several entries,
  // so overflow scrolls horizontally instead.
  wrap: 'off',
  style: {
    resize: 'none',
    boxSizing: 'border-box',
    width: '100%',
    // Pin the metrics the rows attribute multiplies: browsers disagree on
    // the default textarea font size (Firefox resolves monospace larger
    // than Chrome), which otherwise makes the same rows count overflow a
    // fixed-height panel on some of them.
    fontSize: '13px',
    lineHeight: '1.2',
    borderColor: Ed.hasError(value) ? '#f55' : null,
  },
  value: pipe(
    value,
    Ed.text,
    O.getOrElse(pipe(
      Ed.value(value),
      A.join('\n'),
      constant,
    )),
  ),
  ...action,
});
