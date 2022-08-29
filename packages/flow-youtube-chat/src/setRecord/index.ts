export default <T1 extends string | number | symbol, T2>(
  key: T1,
) => (
  value: T2,
) => (
  rec: Record<T1, T2>,
): Record<T1, T2> => ({
  ...rec,
  [key]: value,
});
