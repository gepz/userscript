import AppCommander from '@/AppCommander';
import SettingState from '@/SettingState';
import SettingDispatchable from '@/settingUI/SettingDispatchable';
import StateKey from '@/settingUI/StateKey';
import UpdateType from '@/settingUI/UpdateType';
import updateInput from '@/settingUI/updateInput';

export default <T extends UpdateType>(
  key: StateKey<T>,
  set: (
    editing: boolean,
  ) => (
    value: string,
  ) => (
    state: T,
  ) => T,
) => (c: AppCommander) => ({
  oninput: (s: SettingState, e: Event) => updateInput(set(true))(key)(c)(s, e),
  onchange: (
    s: SettingState,
    e: Event,
  ): SettingDispatchable => updateInput(set(false))(key)(c)(s, e),
});
