import assert from '@userscript/assert';

export default <T>(
  x: T | undefined | null,
): T => {
  assert(x !== undefined && x !== null);
  return x;
};
