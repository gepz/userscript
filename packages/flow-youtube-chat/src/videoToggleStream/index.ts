import * as RA from 'fp-ts/ReadonlyArray';
import {
  pipe,
} from 'fp-ts/function';
import {
  fromEvent,
  merge,
  Observable,
  map,
} from 'rxjs';

export default (video: HTMLVideoElement): Observable<boolean> => pipe(
  [['playing'], ['waiting', 'pause']],
  RA.mapWithIndex((i, x) => [x, i === 0] as const),
  RA.chain(([xs, b]) => pipe(
    xs,
    RA.map((x) => [x, b] as const),
  )),
  RA.map(([x, b]) => pipe(
    fromEvent(video, x),
    map(() => b),
  )),
  (x) => merge(...x),
);
