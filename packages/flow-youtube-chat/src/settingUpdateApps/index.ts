import {
  Ref,
} from 'effect';
import {
  Dispatch,
} from 'hyperapp';

import SettingState from '@/SettingState';

// Dispatchers of the mounted setting apps. Module-level so eventLogger can
// read it from inside logger callbacks; initialize fills it after wrapping
// the apps.
export default Ref.unsafeMake<Dispatch<SettingState>[]>([]);
