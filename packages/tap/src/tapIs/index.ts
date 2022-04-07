import assert from '@userscript/assert';

export default <T, U>(
  constructor: { new (...args: U[]): T },
) => (
  x: unknown,
): T => {
  assert(x instanceof constructor);
  return x;
};
