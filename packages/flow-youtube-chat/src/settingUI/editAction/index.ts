import EditSetter from '@userscript/ui/EditSetter';

import AppCommander from '@/AppCommander';
import SettingKeys from '@/settingUI/SettingKeys';
import UpdateType from '@/settingUI/UpdateType';
import updateInput from '@/settingUI/updateInput';

export default <T extends UpdateType>(
  key: SettingKeys<T>,
  setter: EditSetter<T>,
) => (c: AppCommander) => ({
  oninput: updateInput(setter(true))(key)(c),
  onchange: updateInput(setter(false))(key)(c),
});
