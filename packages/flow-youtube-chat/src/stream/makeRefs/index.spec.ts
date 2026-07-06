import {
  Chunk,
  Effect as Z,
  Fiber,
  Stream,
  SubscriptionRef,
  pipe,
} from 'effect';
import {
  describe,
  expect,
  it,
} from 'vitest';

import makeRefs from '@/stream/makeRefs';

const collectTwo = <A>(
  ref: SubscriptionRef.SubscriptionRef<A>,
): Z.Effect<Fiber.RuntimeFiber<Chunk.Chunk<A>>> => pipe(
  ref.changes,
  Stream.take(2),
  Stream.runCollect,
  Z.fork,
);

describe('makeRefs', () => {
  it('emits the current value first, then subsequent writes', () => (
    // eslint-disable-next-line func-names
    Z.runPromise(Z.gen(function* () {
      const refs = yield * makeRefs({
        count: 0,
      });

      const fiber = yield * collectTwo(refs.count);

      yield * Z.sleep('10 millis');
      yield * SubscriptionRef.set(refs.count, 1);

      const values = yield * Fiber.join(fiber);

      expect(Chunk.toReadonlyArray(values)).toEqual([0, 1]);
      expect(yield * SubscriptionRef.get(refs.count)).toBe(1);
    }))
  ));

  it('multicasts: every subscriber sees every write', () => (
    // eslint-disable-next-line func-names
    Z.runPromise(Z.gen(function* () {
      const refs = yield * makeRefs({
        count: 0,
      });

      const first = yield * collectTwo(refs.count);
      const second = yield * collectTwo(refs.count);

      yield * Z.sleep('10 millis');
      yield * SubscriptionRef.set(refs.count, 1);

      expect(Chunk.toReadonlyArray(yield * Fiber.join(first)))
        .toEqual([0, 1]);

      expect(Chunk.toReadonlyArray(yield * Fiber.join(second)))
        .toEqual([0, 1]);
    }))
  ));

  it('keys are independent: a write to one ref does not emit on another', () => (
    // eslint-disable-next-line func-names
    Z.runPromise(Z.gen(function* () {
      const refs = yield * makeRefs({
        a: 'a0',
        b: 'b0',
      });

      const collected: string[] = [];
      const fiber = yield * pipe(
        refs.b.changes,
        Stream.runForEach((value) => Z.sync(() => {
          collected.push(value);
        })),
        Z.fork,
      );

      yield * Z.sleep('10 millis');
      yield * SubscriptionRef.set(refs.a, 'a1');
      yield * Z.sleep('10 millis');
      yield * Fiber.interrupt(fiber);

      expect(collected).toEqual(['b0']);
    }))
  ));
});
