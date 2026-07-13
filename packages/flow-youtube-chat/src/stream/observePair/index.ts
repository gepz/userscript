import {
  Effect as Z,
  PubSub,
  Runtime,
  Stream,
} from 'effect';

/**
 * Stream-based counterpart of `@/observePair`: constructs an observer
 * (MutationObserver, ResizeObserver, ...) whose callback publishes into a
 * PubSub. Like the Subject it replaces (behavior A2 in stream-behaviors.md),
 * values published while the stream is not being run are dropped.
 */
export default <T, T2>(
  con: new (x: (a: T2) => void) => T,
): Z.Effect<{
  stream: Stream.Stream<T2>
  observer: T
}> => Z.gen(function* () {
  const pubsub = yield * PubSub.unbounded<T2>();
  const runtime = yield * Z.runtime();
  const runPublish = Runtime.runSync(runtime);

  return {
    stream: Stream.fromPubSub(pubsub),
    // eslint-disable-next-line new-cap
    observer: new con((a) => {
      runPublish(PubSub.publish(pubsub, a));
    }),
  };
});
