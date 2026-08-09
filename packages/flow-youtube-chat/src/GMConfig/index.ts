import type GMConfigItem from '@/GMConfigItem';
import type UserConfig from '@/UserConfig';

// Derived forward from the UserConfig root map — see
// docs/decisions.md: indexing with a generic key K yields
// GMConfigItem<UserConfig[K]>, keeping key and codec correlated.
type GMConfig = {
  [K in keyof UserConfig]: GMConfigItem<UserConfig[K]>
};

export default GMConfig;
