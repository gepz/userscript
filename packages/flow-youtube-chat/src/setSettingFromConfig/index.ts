import Editable, * as Ed from '@userscript/ui/Editable';

import {
  isEditableKey,
} from '@/EditableConfig';
import SettingState from '@/SettingState';
import UserConfig from '@/UserConfig';

export default <T extends keyof UserConfig & keyof SettingState>(
  key: T,
) => (
  value: UserConfig[T],
) => (
  state: SettingState,
): SettingState => ({
  ...state,
  [key]: isEditableKey(key)
    ? Ed.setValue(value)(
      // eslint-disable-next-line @typescript-eslint/consistent-type-assertions
      state[key] as Editable<UserConfig[T]>,
    )
    : value,
});
