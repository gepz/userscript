import {
  Effect as Z,
  Stream,
} from 'effect';

/**
 * Constructs an observer (MutationObserver, ResizeObserver, ...) whose
 * callback pushes into the returned stream. The observer exists before the
 * stream runs so callers can imperatively (re)target it; values observed
 * while the stream is not being run are dropped.
 */
export default <T, T2>(
  con: new (x: (a: T2) => void) => T,
): Z.Effect<{
  stream: Stream.Stream<T2>
  observer: T
}> => Z.sync(() => {
  let emit: ((a: T2) => void) | undefined;

  return {
    // eslint-disable-next-line new-cap
    observer: new con((a) => emit?.(a)),
    // Unbounded so observer bursts (e.g. MutationObserver batches) are never
    // dropped while a run is subscribed.
    stream: Stream.asyncPush<T2>((e) => Z.acquireRelease(
      Z.sync(() => {
        const own = (a: T2): void => {
          e.single(a);
        };

        emit = own;

        return own;
      }),
      // Clear only if still ours: a successor run's register may already
      // have replaced emit by the time this run's finalizer executes.
      (own) => Z.sync(() => {
        if (emit === own) {
          emit = undefined;
        }
      }),
    ), {
      bufferSize: 'unbounded',
    }),
  };
});
