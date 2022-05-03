import * as R from 'fp-ts/Reader';

import SettingState from '@/SettingState';
import StateKey from '@/settingUI/StateKey';
import getTrueState from '@/settingUI/getTrueState';

export default <T>(k: StateKey<T>): R.Reader<SettingState, T> => (s) => (
  // eslint-disable-next-line @typescript-eslint/consistent-type-assertions
  s.editingInput.id === k ? (s.editingInput.committedState as T)
  : getTrueState(k)(s)
);
