import {
  pipe,
} from 'fp-ts/function';

import ConfigItem from '@/ConfigItem';

export default async <T1 extends GM.Value, T2>(
  key: string,
  defaultVal: T2,
  toItem: (x: T1) => T2,
  toGm: (x: T2) => GM.Value,
): Promise<ConfigItem<T2>> => pipe(
  await GM.getValue<T1>(key),
  (x) => (x !== undefined ? toItem(x) : defaultVal),
  (x) => ({
    gmKey: key,
    val: x,
    defaultVal,
    toGm,
  }),
);
