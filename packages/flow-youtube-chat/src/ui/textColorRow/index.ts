import * as R from 'fp-ts/Reader';
import {
  pipe,
} from 'fp-ts/function';
import {
  h,
  VNode,
} from 'hyperapp';

export default <T>(
  colorNodes: readonly R.Reader<string, VNode<T>>[],
): R.Reader<string, VNode<T>> => pipe(
  colorNodes,
  R.sequenceArray,
  R.map((x) => h('div', {}, x)),
);
