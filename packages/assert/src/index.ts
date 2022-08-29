// eslint-disable-next-line max-len
// eslint-disable-next-line consistent-default-export-name/default-export-match-filename
import {
  assert as checkAssert,
} from 'check-types';

const assert: (
  value: unknown,
  message?: string
) => asserts value = checkAssert;

export default assert;
