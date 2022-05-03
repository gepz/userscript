import * as R from 'fp-ts/Reader';

import SettingConfig from '@/SettingConfig';
import SettingState from '@/SettingState';
import SettingDispatchable from '@/settingUI/SettingDispatchable';
import StateKey from '@/settingUI/StateKey';
import getTrueState from '@/settingUI/getTrueState';
import updateAt from '@/settingUI/updateAt';
import getValue from '@/ui/getValue';

export default <T>(
  key: StateKey<T>,
  onchange: (k: StateKey<T>) => R.Reader<
  SettingConfig,
  (s: SettingState, e: Event) => SettingDispatchable
  >,
) => (c: SettingConfig) => ({
  onfocus: (s: SettingState, e: Event) => updateAt<typeof s.editingInput>(
    'editingInput',
    {
      id: key,
      committedState: getTrueState(key, s),
      value: getValue(e),
    },
  )(c),
  onblur: (s: SettingState) => updateAt<typeof s.editingInput>(
    'editingInput',
    {
      id: '',
      committedState: '',
      value: '',
    },
  )(c),
  oninput: (s: SettingState, e: Event) => updateAt<typeof s.editingInput>(
    'editingInput',
    {
      id: key,
      committedState: s.editingInput.committedState,
      value: getValue(e),
    },
  )(c),
  onchange: (
    s: SettingState,
    e: Event,
  ): SettingDispatchable => {
    const [s1, ...es1] = onchange(key)(c)(s, e);
    const x: typeof s1.editingInput = s1.editingInput.id === key ? {
      id: key,
      committedState: getTrueState(key, s1),
      value: getValue(e),
    } : s1.editingInput;

    const [s2, ...es2] = updateAt('editingInput', x)({
      ...c,
      state: s1,
    });

    return [s2, ...es1, ...es2];
  },
});
