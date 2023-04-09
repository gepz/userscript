import AppCommander from '@/AppCommander';
import SettingState from '@/SettingState';
import SettingDispatchable from '@/settingUI/SettingDispatchable';
import StateKey from '@/settingUI/StateKey';
import UpdateType from '@/settingUI/UpdateType';
import updateInput from '@/settingUI/updateInput';
import EditSetter from '@userscript/ui/EditSetter';

export default <T extends UpdateType>(
  key: StateKey<T>,
  setter: EditSetter<T>,
) => (c: AppCommander) => ({
  oninput: (s: SettingState, e: Event) => updateInput(
    setter(true),
  )(key)(c)(s, e),
  onchange: (
    s: SettingState,
    e: Event,
  ): SettingDispatchable => updateInput(setter(false))(key)(c)(s, e),
});
