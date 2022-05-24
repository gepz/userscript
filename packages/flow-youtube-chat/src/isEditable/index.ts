import * as RA from 'fp-ts/ReadonlyArray';

import SettingState from '@/SettingState';
import UserConfig from '@/UserConfig';

const exceptions: (keyof UserConfig & keyof SettingState)[] = [
  'timingFunction',
  'lang',
];

export default (
  k: string,
) => (
  v: unknown,
) => (typeof v === 'number'
 || typeof v === 'string'
 || (Array.isArray(v) && (typeof v[0] === 'string' || v.length === 0)))
 && !RA.some<string>((x) => x === k)(exceptions);
