import type UserConfig from '@/UserConfig';

// Distributive object type over the UserConfig root map
// (docs/decisions.md): ConfigEntry<K> is the matched [key, value]
// pair for K, and the default instantiation is the union of every pair —
// the message type of the config BroadcastChannel.
type ConfigEntry<K extends keyof UserConfig = keyof UserConfig> = {
  [P in K]: [P, UserConfig[P]]
}[K];

export default ConfigEntry;

// The one checked construction point for entries headed to a
// union-typed boundary (channel.postMessage). The local annotation
// verifies the [key, value] pairing; the return upcast is sound — a
// single-key entry is one member of the full union — but beyond the
// checker, which never distributes a generic indexed access onto the
// union target (docs/decisions.md).
export const makeEntry = <K extends keyof UserConfig>(
  key: K,
  val: UserConfig[K],
): ConfigEntry => {
  const entry: ConfigEntry<K> = [key, val];
  // eslint-disable-next-line @typescript-eslint/consistent-type-assertions
  return entry as ConfigEntry;
};
