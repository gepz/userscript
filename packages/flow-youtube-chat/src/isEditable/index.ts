import {
  Array as A,
} from 'effect';

import SettingState from '@/SettingState';
import UserConfig from '@/UserConfig';

// excludedLanes must stay a plain value: a two-element excluded set
// would otherwise pass updateAt's Editable-tuple shape check and be
// unwrapped as [value, text].
const exceptions = [
  'timingFunction',
  'lang',
  'excludedLanes',
] satisfies (keyof UserConfig & keyof SettingState)[];

export default (
  k: string,
) => (
  v: unknown,
) => (typeof v === 'number'
  || typeof v === 'string'
  || (Array.isArray(v) && (typeof v[0] === 'string' || v.length === 0)))
&& A.every(exceptions, (x) => x !== k);
