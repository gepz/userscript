import {
  Effect as Z,
  Record as R,
  SubscriptionRef,
} from 'effect';

type Refs<T> = {
  [K in keyof T]: SubscriptionRef.SubscriptionRef<T[K]>
};

/**
 * One SubscriptionRef per record key, seeded with the key's current value.
 * Replaces the per-key Subject maps (`ConfigSubject`): unlike a Subject,
 * `.changes` on each ref emits the current value first.
 */
/* eslint-disable @typescript-eslint/consistent-type-assertions --
   R.map collapses the per-key value types to their union; the cast restores
   the precise mapped type. */
export default <T extends Record<string, unknown>>(
  o: T,
): Z.Effect<Refs<T>> => Z.all(
  R.map(o, (v) => SubscriptionRef.make(v)),
) as Z.Effect<Refs<T>>;
/* eslint-enable @typescript-eslint/consistent-type-assertions */
