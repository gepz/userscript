import SettingState from '@/SettingState';
import {
  TypeKey,
} from '@/TypeKey';
import computed from '@/settingUI/computed';

type StateKey<T> = TypeKey<SettingState, T>
| TypeKey<typeof computed, (s: SettingState) => T>;

export default StateKey;
