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
});
