import {
  pipe,
} from '@effect/data/Function';
import * as RA from '@effect/data/ReadonlyArray';
import {
  h,
  VNode,
  Action,
  text,
} from 'hyperapp';

import TabContainerStyle from '@/ui/TabContainerStyle';

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
    RA.map((x, i) => h('span', {
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
      overflow: 'auto',
    },
  }, h('div', {
    style: {
      ...style.tab,
    },
  }, tabs.find((_, i) => i === mainTab)?.())),
]);
