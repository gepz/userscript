import {
  assert as checkAssert,
} from 'check-types';

const assert: (
  value: unknown,
  message?: string
) => asserts value = checkAssert;

export default assert;
