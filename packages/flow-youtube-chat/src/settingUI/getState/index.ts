import SettingState from '@/SettingState';
import SettingKey from '@/settingUI/SettingKey';
import SettingProps from '@/settingUI/SettingProps';
import computed from '@/settingUI/computed';

type SettingGetter<K extends SettingKey<unknown>> = (
  s: SettingState,
) => SettingProps[K];

type SettingGetterTable = {
  [K in SettingKey<unknown>]?: SettingGetter<K>
};

const computedGetters: SettingGetterTable = computed;

// A partial view so a generic index stays correlated — see lookupHandler
// in settingUI/SettingHandler and docs/decisions.md.
type StateView = { readonly [K in SettingKey<unknown>]?: SettingProps[K] };

const lookupGetter = <K extends SettingKey<unknown>>(
  table: SettingGetterTable,
  k: K,
): SettingGetter<K> | undefined => table[k];

export default <K extends SettingKey<unknown>>(k: K): (
  s: SettingState,
) => SettingProps[K] => lookupGetter(computedGetters, k)
  ?? ((s) => {
    const view: StateView = s;
    const v = view[k];
    if (v === undefined) {
      // Unreachable: SettingKey<unknown> is keyof SettingState plus the
      // computed keys, and computedGetters covers every computed key.
      throw new Error(`No getter for setting key: ${k}`);
    }

    return v;
  });
