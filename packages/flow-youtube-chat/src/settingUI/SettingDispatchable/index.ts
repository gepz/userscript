import {
  Effect,
} from 'hyperapp';

import SettingState from '@/SettingState';

type SettingDispatchable = [s: SettingState, ...e: Effect<SettingState>[]];

export default SettingDispatchable;
