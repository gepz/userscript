type Arr = readonly unknown[];

export default <T1 extends Arr, T2 extends Arr, T3>(
  x: (...a: T1) => (...b: T2) => T3,
): (
  (...b: T2) => (...a: T1) => T3
) => (...b) => (...a) => x(...a)(...b);
