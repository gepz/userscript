declare type Arr = readonly unknown[];
declare const _default: <T extends Arr, U extends Arr, R>(f: (...args: [...T, ...U]) => R, ...headArgs: T) => (...restArgs: U) => R;
export default _default;
//# sourceMappingURL=index.d.ts.map