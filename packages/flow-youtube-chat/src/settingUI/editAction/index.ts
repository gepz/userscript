import EditSetter from '@userscript/ui/EditSetter';

import AppCommander from '@/AppCommander';
import SettingKeys from '@/settingUI/SettingKeys';
import SettingValues from '@/settingUI/SettingValues';
import updateInput from '@/settingUI/updateInput';

export default <K extends SettingKeys<unknown>>(
  key: K,
  setter: EditSetter<SettingValues<K>>,
) => (c: AppCommander) => ({
  oninput: updateInput(key)(setter(true))(c),
  onchange: updateInput(key)(setter(false))(c),
});
