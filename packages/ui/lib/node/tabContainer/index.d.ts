import { VNode, Action, StyleProp } from 'hyperapp';
export interface TabContainerStyle {
    container: StyleProp;
    label: StyleProp;
    labelFocus: StyleProp;
    tab: StyleProp;
}
declare const _default: <T>(style: TabContainerStyle) => (ontabSelect: Action<T>) => (labels: readonly string[]) => (tabs: readonly (() => readonly VNode<T>[])[]) => (mainTab: number) => VNode<T>;
export default _default;
//# sourceMappingURL=index.d.ts.map