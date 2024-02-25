import * as RA from 'effect/ReadonlyArray';

import SettingState from '@/SettingState';
import UserConfig from '@/UserConfig';

const exceptions = [
  'timingFunction',
  'lang',
] satisfies (keyof UserConfig & keyof SettingState)[];

export default (
  k: string,
) => (
  v: unknown,
) => (typeof v === 'number'
 || typeof v === 'string'
 || (Array.isArray(v) && (typeof v[0] === 'string' || v.length === 0)))
 && !RA.some<string>((x) => x === k)(exceptions);

