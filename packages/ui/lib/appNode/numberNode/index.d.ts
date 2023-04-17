/// <reference types="hyperapp" />
declare const _default: <State, Props, AppCommander, Key extends import("../../ExactTypeKey").default<Props, import("../../Editable").default<number>>>(editAction: import("../..").EditAction<State, Props, AppCommander>, getText: import("../AppTextGetter").default<Key, State>, getState: <K extends import("../../ExactTypeKey").default<Props, import("../../Editable").default<number>>>(k: K) => (s: State) => import("../../Editable").default<number>) => (label: Key, min: number, max: number, step: number) => (c: AppCommander) => (s: State) => import("hyperapp", { assert: { "resolution-mode": "import" } }).VNode<State>;
export default _default;
//# sourceMappingURL=index.d.ts.map