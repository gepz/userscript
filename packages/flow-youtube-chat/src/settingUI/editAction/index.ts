import EditSetter from '@userscript/ui/EditSetter';

import AppCommander from '@/AppCommander';
import StateKey from '@/settingUI/StateKey';
import UpdateType from '@/settingUI/UpdateType';
import updateInput from '@/settingUI/updateInput';

export default <T extends UpdateType>(
  key: StateKey<T>,
  setter: EditSetter<T>,
) => (c: AppCommander) => ({
  oninput: updateInput(setter(true))(key)(c),
  onchange: updateInput(setter(false))(key)(c),
});
