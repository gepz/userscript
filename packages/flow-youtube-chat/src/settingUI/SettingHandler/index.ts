import AppCommander from '@/AppCommander';
import SettingState from '@/SettingState';
import SettingDispatchable from '@/settingUI/SettingDispatchable';
import SettingKey from '@/settingUI/SettingKey';
import SettingProps from '@/settingUI/SettingProps';

type SettingHandler<K extends SettingKey<unknown>> = (
  v: SettingProps[K],
) => (c: AppCommander) => (s: SettingState) => SettingDispatchable;

export default SettingHandler;

export type SettingHandlerTable = {
  [K in SettingKey<unknown>]?: SettingHandler<K>
};

// Generic index into the partial mapped table: yields the correlated
// handler or undefined, replacing `in`-narrowing, which cannot narrow a
// generic key (docs/correlated-unions.md).
export const lookupHandler = <K extends SettingKey<unknown>>(
  table: SettingHandlerTable,
  k: K,
): SettingHandler<K> | undefined => table[k];
