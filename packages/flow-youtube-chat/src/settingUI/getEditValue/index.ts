import * as R from 'fp-ts/Reader';

import SettingState from '@/SettingState';
import StateKey from '@/settingUI/StateKey';
import getState from '@/settingUI/getState';

export default <T>(
  k: StateKey<T>,
  t: (x: T) => string,
): R.Reader<SettingState, string> => (s) => (
  (s.editingInput.id === k) ? s.editingInput.value
  : t(getState(k)(s))
);
