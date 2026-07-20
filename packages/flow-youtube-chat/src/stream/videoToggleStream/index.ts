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
 * Maps the video element's play-state events to booleans: `playing` to true,
 * `waiting` and `pause` to false. Listeners are attached per stream run.
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
