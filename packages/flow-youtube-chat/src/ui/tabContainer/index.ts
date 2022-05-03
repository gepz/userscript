import * as RA from 'fp-ts/ReadonlyArray';
import {
  pipe,
} from 'fp-ts/function';
import {
  h,
  VNode,
  Action,
  text,
} from 'hyperapp';

import TabContainerStyle from '../TabContainerStyle';

export default <T>(
  style: TabContainerStyle,
) => (
  ontabSelect: Action<T>,
) => (
  labels: readonly string[],
) => (
  tabs: readonly (() => readonly VNode<T>[])[],
) => (
  mainTab: number,
): VNode<T> => h('div', {}, [
  h('div', {}, pipe(
    labels,
    RA.mapWithIndex((i, x) => h('span', {
      style: {
        ...style.label,
        ...(mainTab === i ? style.labelFocus : {}),
        display: 'inline-block',
      },
      onpointerdown: [ontabSelect, i],
    }, text(x))),
  )),
  h('div', {
    style: {
      ...style.container,
      overflow: 'hidden auto',
    },
  }, h('div', {
    style: {
      ...style.tab,
    },
  }, tabs.find((_, i) => i === mainTab)?.())),
]);
