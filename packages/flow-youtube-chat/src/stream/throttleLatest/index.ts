import {
  Duration as D,
  Effect as Z,
  Option as O,
  Queue,
  Ref,
  Stream,
  Take,
  pipe,
} from 'effect';

type Window<A>
  = | {
    open: false
  }
  | {
    open: true
    pending: O.Option<A>
  };

/**
 * rxjs `throttleTime(d, { leading: true, trailing: true })` semantics
 * (behavior T1 in stream-behaviors.md): the first element of a burst is
 * emitted immediately and opens a window of `d`; the latest element arriving
 * during the window is emitted when it closes, which opens a new window; a
 * window closing with nothing pending ends the train. A lone element is
 * emitted exactly once. When upstream ends, a pending trailing element is
 * flushed before the stream ends.
 */
export default (
  durationInput: D.DurationInput,
) => <A, E, R>(
  self: Stream.Stream<A, E, R>,
): Stream.Stream<A, E, R> => {
  const duration = D.decode(durationInput);

  return Stream.unwrapScoped(Z.gen(function* () {
    const output = yield * Queue.unbounded<Take.Take<A, E>>();
    const gate = yield * Z.makeSemaphore(1);
    const window = yield * Ref.make<Window<A>>({
      open: false,
    });

    // One fiber per burst train: sleeps out the current window, emits the
    // trailing element if one arrived (opening the next window), and stops
    // at the first empty window.
    const windowTrain: Z.Effect<void> = Z.gen(function* () {
      for (;;) {
        yield * Z.sleep(duration);

        const emitted = yield * gate.withPermits(1)(Z.gen(function* () {
          const state = yield * Ref.get(window);

          if (!state.open || O.isNone(state.pending)) {
            yield * Ref.set(window, {
              open: false,
            });

            return false;
          }

          yield * Queue.offer(output, Take.of(state.pending.value));
          yield * Ref.set(window, {
            open: true,
            pending: O.none(),
          });

          return true;
        }));

        if (!emitted) {
          return;
        }
      }
    });

    // Returns whether a new window train was opened.
    const onElement = (element: A): Z.Effect<boolean> => gate.withPermits(1)(
      Z.gen(function* () {
        const state = yield * Ref.get(window);

        if (state.open) {
          yield * Ref.set(window, {
            open: true,
            pending: O.some(element),
          });

          return false;
        }

        yield * Queue.offer(output, Take.of(element));
        yield * Ref.set(window, {
          open: true,
          pending: O.none(),
        });

        return true;
      }),
    );

    const consume = pipe(
      self,
      Stream.runForEach((element) => pipe(
        onElement(element),
        Z.flatMap((opened) => (opened ? Z.fork(windowTrain) : Z.void)),
        Z.asVoid,
      )),
      Z.matchCauseEffect({
        onFailure: (cause) => Queue.offer(output, Take.failCause(cause)),
        onSuccess: () => Z.gen(function* () {
          const state = yield * gate.withPermits(1)(Ref.get(window));

          if (state.open && O.isSome(state.pending)) {
            yield * Queue.offer(output, Take.of(state.pending.value));
          }

          yield * Queue.offer(output, Take.end);
        }),
      }),
    );

    yield * Z.forkScoped(consume);

    return Stream.flattenTake(Stream.fromQueue(output));
  }));
};
