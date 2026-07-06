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

import videoToggleStream from '@/stream/videoToggleStream';

describe('videoToggleStream', () => {
  it('maps playing to true and waiting/pause to false, ignoring others', () => (
    // eslint-disable-next-line func-names
    Z.runPromise(Z.gen(function* () {
      const video = new EventTarget();
      const collected: boolean[] = [];
      const fiber = yield * pipe(
        videoToggleStream(video),
        Stream.take(3),
        Stream.runForEach((value) => Z.sync(() => {
          collected.push(value);
        })),
        Z.fork,
      );

      yield * Z.sleep('10 millis');

      video.dispatchEvent(new Event('playing'));
      video.dispatchEvent(new Event('seeking'));
      video.dispatchEvent(new Event('waiting'));
      video.dispatchEvent(new Event('pause'));

      yield * Fiber.join(fiber);

      expect(collected).toEqual([true, false, false]);
    }))
  ));
});
