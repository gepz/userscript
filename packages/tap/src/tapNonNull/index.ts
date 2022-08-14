import assert from '@userscript/assert';

export default <T>(
  x: T,
): NonNullable<T> => {
  assert(x !== undefined && x !== null);
  return x;
};
