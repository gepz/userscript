import * as Z from 'effect/Effect';
import {
  identity,
} from 'effect/Function';

import GMConfigItem from '@/GMConfigItem';

export default <T extends GM.Value>(
  key: string,
  defaultValue: T,
): GMConfigItem<T> => ({
  gmKey: key,
  getValue: Z.promise(async () => await GM.getValue(key, defaultValue)),
  defaultValue,
  toGm: identity,
});

