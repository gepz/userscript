import type GMConfigItem from '@/GMConfigItem';
import type UserConfig from '@/UserConfig';

// Derived forward from the UserConfig root map — see "Per-key config
// machinery" in docs/decisions.md.
type GMConfig = {
  [K in keyof UserConfig]: GMConfigItem<UserConfig[K]>
};

export default GMConfig;
