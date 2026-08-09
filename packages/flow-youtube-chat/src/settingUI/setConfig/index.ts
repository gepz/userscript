import * as Ed from '@userscript/ui/Editable';
import {
  Record as R,
  pipe,
} from 'effect';

import AppCommander from '@/AppCommander';
import {
  EditableConfigKey,
  EditableConfigValues,
  isEditableKey,
} from '@/EditableConfig';
import SettingState from '@/SettingState';
import UserConfig from '@/UserConfig';
import configKeys from '@/configKeys';
import SettingDispatchable from '@/settingUI/SettingDispatchable';
import {
  SettingHandlerTable,
} from '@/settingUI/SettingHandler';
import configEffect from '@/settingUI/configEffect';

// Handlers for the config-backed setting keys: write the state field,
// then persist through the commander. Declared per key class so the
// key-value correlation is checked generically — the Editable unwrap is
// what distinguishes the classes (docs/decisions.md).
const editableHandler = <K extends EditableConfigKey>(k: K) => (
  v: EditableConfigValues[K],
) => (c: AppCommander) => (s: SettingState): SettingDispatchable => [
  {
    ...s,
    [k]: v,
  },
  configEffect(k, Ed.value(v))(c),
];

const plainHandler = <K extends Exclude<keyof UserConfig, EditableConfigKey>>(
  k: K,
) => (
  v: UserConfig[K],
) => (c: AppCommander) => (s: SettingState): SettingDispatchable => [
  {
    ...s,
    [k]: v,
  },
  configEffect(k, v)(c),
];

// The handlers are checked above; assembling them into the heterogeneous
// table goes through one assertion (fromIterableWith erases per-key
// types).
const setConfig: SettingHandlerTable = pipe(
  configKeys,
  // eslint-disable-next-line @typescript-eslint/consistent-type-assertions
  (ks) => R.fromIterableWith(ks, (k) => [
    k,
    isEditableKey(k) ? editableHandler(k) : plainHandler(k),
  ]) as SettingHandlerTable,
);

export default setConfig;
