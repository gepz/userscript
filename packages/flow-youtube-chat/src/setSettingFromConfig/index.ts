import * as Ed from '@userscript/ui/Editable';

import {
  EditableConfigValues,
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
): SettingState => {
  // Read through the EditableConfigValues view: isEditableKey narrows
  // the generic key, and indexing the mapped type with it yields the
  // correlated Editable<UserConfig[T & EditableConfigKey]>
  // (docs/decisions.md).
  const editables: EditableConfigValues = state;

  return {
    ...state,
    [key]: isEditableKey(key)
      ? Ed.setValue(value)(editables[key])
      : value,
  };
};
