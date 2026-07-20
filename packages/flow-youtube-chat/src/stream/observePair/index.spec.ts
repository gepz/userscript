import {
  Effect as Z,
  Fiber,
  Stream,
  pipe,
} from 'effect';
import {
  describe,
  expect,
  it,
} from 'vitest';

import observePair from '@/stream/observePair';

class FakeObserver {
  readonly emit: (a: string) => void;

  constructor(emit: (a: string) => void) {
    this.emit = emit;
  }
}

describe('observePair', () => {
  it('delivers callback values to a running stream in order', () => (
    Z.runPromise(Z.gen(function* () {
      const {
        stream, observer,
      } = yield * observePair(FakeObserver);

      const collected: string[] = [];
      const fiber = yield * pipe(
        stream,
        Stream.take(2),
        Stream.runForEach((value) => Z.sync(() => {
          collected.push(value);
        })),
        Z.fork,
      );

      yield * Z.sleep('10 millis');

      observer.emit('a');
      observer.emit('b');

      yield * Fiber.join(fiber);

      expect(collected).toEqual(['a', 'b']);
    }))
  ));

  it('drops values published while nothing is subscribed', () => (
    Z.runPromise(Z.gen(function* () {
      const {
        stream, observer,
      } = yield * observePair(FakeObserver);

      observer.emit('early');

      const collected: string[] = [];
      const fiber = yield * pipe(
        stream,
        Stream.take(1),
        Stream.runForEach((value) => Z.sync(() => {
          collected.push(value);
        })),
        Z.fork,
      );

      yield * Z.sleep('10 millis');

      observer.emit('late');

      yield * Fiber.join(fiber);

      expect(collected).toEqual(['late']);
    }))
  ));

  // allStream re-subscribes each pair's stream on every poll tick (switch
  // semantics), so a fresh run after a completed one must receive values.
  it('delivers to a second run after the first completes', () => (
    Z.runPromise(Z.gen(function* () {
      const {
        stream, observer,
      } = yield * observePair(FakeObserver);

      const run = (collected: string[]): Z.Effect<Fiber.RuntimeFiber<void>> => pipe(
        stream,
        Stream.take(1),
        Stream.runForEach((value) => Z.sync(() => {
          collected.push(value);
        })),
        Z.fork,
      );

      const first: string[] = [];
      const firstFiber = yield * run(first);

      yield * Z.sleep('10 millis');

      observer.emit('a');

      yield * Fiber.join(firstFiber);

      observer.emit('dropped between runs');

      const second: string[] = [];
      const secondFiber = yield * run(second);

      yield * Z.sleep('10 millis');

      observer.emit('b');

      yield * Fiber.join(secondFiber);

      expect(first).toEqual(['a']);
      expect(second).toEqual(['b']);
    }))
  ));
});
