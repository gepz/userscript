import * as t from 'typed-assert';

export default <T extends Exclude<unknown, undefined | null>>(
  x: T | undefined | null,
  message?: string,
): T => {
  t.isNotVoid(x, message);
  return x;
};
