import {
  Effect as Z,
  Record as R,
  SubscriptionRef,
} from 'effect';

import ConfigRefs from '@/ConfigRefs';
import UserConfig from '@/UserConfig';

/**
 * One SubscriptionRef per config key, seeded with the key's current value.
 * Replaces the per-key Subject maps (`ConfigSubject`): unlike a Subject,
 * `.changes` on each ref emits the current value first.
 */
// eslint-disable-next-line @typescript-eslint/consistent-type-assertions
export default (o: UserConfig): Z.Effect<ConfigRefs> => Z.all(
  R.map(o, (v) => SubscriptionRef.make(v)),
) as Z.Effect<ConfigRefs>;
