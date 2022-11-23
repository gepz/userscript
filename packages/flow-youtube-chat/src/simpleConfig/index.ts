import {
  identity,
} from 'fp-ts/function';

import GMConfigItem from '@/GMConfigItem';

export default <T extends GM.Value>(
  key: string,
  defaultValue: T,
): GMConfigItem<T> => ({
  gmKey: key,
  getValue: async () => await GM.getValue(key) ?? defaultValue,
  defaultValue,
  toGm: identity,
});
