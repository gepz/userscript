import {
  Effect as Z,
  Struct,
  SubscriptionRef,
  pipe,
} from 'effect';

/**
 * Effectful sibling of `@/mapObject`: one SubscriptionRef per property,
 * seeded with the property's current value. Replaces the per-key Subject
 * maps (`ConfigSubject`): unlike a Subject, `.changes` on each ref emits the
 * current value first (behavior R1 in stream-behaviors.md).
 */
export default <T extends object>(
  o: T,
): Z.Effect<{ [P in keyof T]: SubscriptionRef.SubscriptionRef<T[P]> }> => pipe(
  Struct.entries(o),
  Z.forEach(([k, v]) => pipe(
    SubscriptionRef.make(v),
    Z.map((ref) => [k, ref] as const),
  )),
  Z.map(Object.fromEntries),
);
