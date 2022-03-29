type Arr = readonly unknown[];

export default <T extends Arr, U extends Arr, R>(
  f: (...args: [...T, ...U]) => R,
  ...headArgs: T
) => (...restArgs: U): R => f(...headArgs, ...restArgs);
