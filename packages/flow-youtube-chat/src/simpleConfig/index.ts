import {
  identity,
} from 'fp-ts/function';

import ConfigItem from '@/ConfigItem';

export default async <T extends GM.Value>(
  key: string,
  defaultVal: T,
): Promise<ConfigItem<T>> => ({
  gmKey: key,
  val: await GM.getValue(key) ?? defaultVal,
  defaultVal,
  toGm: identity,
});
