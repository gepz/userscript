import {
  Effect as Z,
} from 'effect';
import {
  identity,
} from 'effect/Function';

import GMConfigItem from '@/GMConfigItem';

export default <T extends GM.Value>(
  key: string,
  defaultValue: T,
): GMConfigItem<T> => ({
  gmKey: key,
  getValue: Z.promise(async () => GM.getValue(key, defaultValue)),
  defaultValue,
  toGm: identity,
});
