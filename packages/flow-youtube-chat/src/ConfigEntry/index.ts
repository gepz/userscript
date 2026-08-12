import type UserConfig from '@/UserConfig';

// Distributive object type over the UserConfig root map
// (docs/decisions.md): ConfigEntry<K> is the matched [key, value]
// pair for K, and the default instantiation is the union of every pair —
// the message type of the config BroadcastChannel.
type ConfigEntry<K extends keyof UserConfig = keyof UserConfig> = {
  [P in K]: [P, UserConfig[P]]
}[K];

export default ConfigEntry;

// The one checked construction point for entries headed to the
// union-typed channel boundary; the widening upcast is sound but beyond
// the checker — see "Per-key config machinery" in docs/decisions.md.
export const makeEntry = <K extends keyof UserConfig>(
  key: K,
  val: UserConfig[K],
): ConfigEntry => {
  const entry: ConfigEntry<K> = [key, val];
  // eslint-disable-next-line @typescript-eslint/consistent-type-assertions
  return entry as ConfigEntry;
};
