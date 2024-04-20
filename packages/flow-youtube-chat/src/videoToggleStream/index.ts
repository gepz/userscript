import {
  pipe,
} from 'effect/Function';
import * as A from 'effect/Array';
import {
  fromEvent,
  merge,
  Observable,
  map,
} from 'rxjs';

export default (video: HTMLVideoElement): Observable<boolean> => pipe(
  [['playing'], ['waiting', 'pause']],
  A.map((x, i) => [x, i === 0] as const),
  A.flatMap(([xs, b]) => pipe(
    xs,
    A.map((x) => [x, b] as const),
  )),
  A.map(([x, b]) => pipe(
    fromEvent(video, x),
    map(() => b),
  )),
  (x) => merge(...x),
);
