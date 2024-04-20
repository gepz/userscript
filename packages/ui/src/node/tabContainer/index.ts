import * as A from 'effect/Array';
import {
  pipe,
} from 'effect/Function';
import * as O from 'effect/Option';
import {
  h,
  VNode,
  Action,
  text,
  StyleProp,
} from 'hyperapp';

export interface TabContainerStyle {
  container: StyleProp,
  label: StyleProp,
  labelFocus: StyleProp,
  tab: StyleProp,
}

export default <T>(
  style: TabContainerStyle,
) => (
  ontabSelect: Action<T, number>,
) => (
  labels: readonly string[],
) => (
  tabs: readonly (() => readonly VNode<T>[])[],
) => (
  mainTab: number,
): VNode<T> => h('div', {
  style: style.container,
}, [
  h('div', {}, pipe(
    labels,
    A.map((x, i) => h('span', {
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
      ...style.tab,
      overflow: 'auto',
      boxSizing: 'border-box',
    },
  }, pipe(
    tabs,
    A.get(mainTab),
    O.match({
      onNone: () => undefined,
      onSome: (x) => x(),
    }),
  )),
]);
