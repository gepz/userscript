import {
  Chunk,
  Duration as D,
  Effect as Z,
  Fiber,
  Stream,
  TestClock,
  TestContext,
  pipe,
} from 'effect';
import {
  describe,
  expect,
  it,
} from 'vitest';

import throttleLatest from '@/stream/throttleLatest';

const runTest = <A, E>(effect: Z.Effect<A, E>): Promise<A> => Z.runPromise(
  Z.provide(effect, TestContext.TestContext),
);

// Emits each value after sleeping its delta (ms since the previous value),
// then ends.
const timed = <A>(
  deltas: readonly (readonly [number, A])[],
): Stream.Stream<A> => pipe(
  Stream.fromIterable(deltas),
  Stream.mapEffect(([ms, value]) => pipe(
    Z.sleep(D.millis(ms)),
    Z.as(value),
  )),
);

// Runs the throttled stream in the background, pushing emissions into the
// returned array so tests can assert intermediate states between
// TestClock.adjust calls.
const collectInBackground = <A>(
  stream: Stream.Stream<A>,
) => Z.gen(function* () {
  const collected: A[] = [];
  const fiber = yield * pipe(
    stream,
    Stream.runForEach((value) => Z.sync(() => {
      collected.push(value);
    })),
    Z.fork,
  );

  return {
    collected,
    fiber,
  };
});

describe('throttleLatest', () => {
  it('emits the first element immediately and the latest at window end', () => (
    runTest(Z.gen(function* () {
      // concat(never): production sources don't complete, and completion
      // triggers the trailing flush tested separately below.
      const {
        collected, fiber,
      } = yield * collectInBackground(pipe(
        Stream.concat(timed([[0, 'a'], [30, 'b'], [30, 'c']]), Stream.never),
        throttleLatest('100 millis'),
      ));

      yield * TestClock.adjust('60 millis');

      expect(collected).toEqual(['a']);

      yield * TestClock.adjust('40 millis');

      expect(collected).toEqual(['a', 'c']);

      yield * TestClock.adjust('500 millis');

      expect(collected).toEqual(['a', 'c']);

      yield * Fiber.interrupt(fiber);
    }))
  ));

  it('opens a new window when the trailing element is emitted', () => (
    runTest(Z.gen(function* () {
      const {
        collected, fiber,
      } = yield * collectInBackground(pipe(
        Stream.concat(timed([[0, 'a'], [50, 'b'], [80, 'c']]), Stream.never),
        throttleLatest('100 millis'),
      ));

      // b trails at t=100 and opens a window until t=200; c (t=130) parks.
      yield * TestClock.adjust('199 millis');

      expect(collected).toEqual(['a', 'b']);

      yield * TestClock.adjust('1 millis');

      expect(collected).toEqual(['a', 'b', 'c']);

      yield * Fiber.interrupt(fiber);
    }))
  ));

  it('treats an element after an empty window as leading again', () => (
    runTest(Z.gen(function* () {
      const {
        collected, fiber,
      } = yield * collectInBackground(pipe(
        timed([[0, 'a'], [150, 'b']]),
        throttleLatest('100 millis'),
      ));

      yield * TestClock.adjust('149 millis');

      expect(collected).toEqual(['a']);

      yield * TestClock.adjust('1 millis');

      expect(collected).toEqual(['a', 'b']);

      yield * TestClock.adjust('500 millis');
      yield * Fiber.join(fiber);
    }))
  ));

  it('emits a lone element exactly once', () => (
    runTest(Z.gen(function* () {
      const {
        collected, fiber,
      } = yield * collectInBackground(pipe(
        timed([[0, 'a']]),
        throttleLatest('100 millis'),
      ));

      yield * TestClock.adjust('500 millis');
      yield * Fiber.join(fiber);

      expect(collected).toEqual(['a']);
    }))
  ));

  it('flushes a pending trailing element when upstream ends', () => (
    runTest(Z.gen(function* () {
      const result = yield * pipe(
        timed([[0, 'a'], [30, 'b']]),
        throttleLatest('100 millis'),
        Stream.runCollect,
        Z.fork,
        Z.flatMap((fiber) => Z.gen(function* () {
          yield * TestClock.adjust('30 millis');

          return yield * Fiber.join(fiber);
        })),
      );

      expect(Chunk.toReadonlyArray(result)).toEqual(['a', 'b']);
    }))
  ));

  it('propagates upstream failure', () => (
    runTest(Z.gen(function* () {
      const fiber = yield * pipe(
        Stream.concat(timed([[0, 'a']]), Stream.fail('boom')),
        throttleLatest('100 millis'),
        Stream.runCollect,
        Z.flip,
        Z.fork,
      );

      yield * TestClock.adjust('1 millis');

      const error = yield * Fiber.join(fiber);

      expect(error).toBe('boom');
    }))
  ));
});
