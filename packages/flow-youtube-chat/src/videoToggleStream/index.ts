import {
  pipe,
} from '@effect/data/Function';
import * as RA from '@effect/data/ReadonlyArray';
import {
  fromEvent,
  merge,
  Observable,
  map,
} from 'rxjs';

export default (video: HTMLVideoElement): Observable<boolean> => pipe(
  [['playing'], ['waiting', 'pause']],
  RA.map((x, i) => [x, i === 0] as const),
  RA.flatMap(([xs, b]) => pipe(
    xs,
    RA.map((x) => [x, b] as const),
  )),
  RA.map(([x, b]) => pipe(
    fromEvent(video, x),
    map(() => b),
  )),
  (x) => merge(...x),
);
