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
  // Widened to the EditableConfigValues view so the key stays
  // correlated ("Per-key config machinery", docs/decisions.md).
  const editables: EditableConfigValues = state;

  return {
    ...state,
    [key]: isEditableKey(key)
      ? Ed.setValue(value)(editables[key])
      : value,
  };
};
