import SettingState from '@/SettingState';
import SettingDispatchable from '@/settingUI/SettingDispatchable';
import {
  lookupHandler,
} from '@/settingUI/SettingHandler';
import SettingKey from '@/settingUI/SettingKey';
import SettingProps from '@/settingUI/SettingProps';
import setComputed from '@/settingUI/setComputed';
import setConfig from '@/settingUI/setConfig';
import setState from '@/settingUI/setState';

// Dispatch in precedence order: computed-property setters, per-key state
// setters, config-backed writes, then a plain state write. Table lookups
// return the correlated handler (docs/decisions.md).
export default <K extends SettingKey<unknown>>(k: K) => (
  v: SettingProps[K],
) => {
  const handler = lookupHandler(setComputed, k)
    ?? lookupHandler(setState, k)
    ?? lookupHandler(setConfig, k);

  return handler !== undefined
    ? handler(v)
    : () => (s: SettingState): SettingDispatchable => [
      {
        ...s,
        [k]: v,
      },
    ];
};
