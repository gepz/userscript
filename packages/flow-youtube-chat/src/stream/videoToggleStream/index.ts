import {
  Array as A,
  Stream,
} from 'effect';

const toggleEvents: readonly (readonly [string, boolean])[] = [
  ['playing', true],
  ['waiting', false],
  ['pause', false],
];

/**
 * Listeners are attached per stream run.
 */
export default (video: EventTarget): Stream.Stream<boolean> => Stream.mergeAll(
  A.map(toggleEvents, ([type, playing]) => Stream.map(
    Stream.fromEventListener(video, type),
    () => playing,
  )),
  {
    concurrency: 'unbounded',
  },
);
