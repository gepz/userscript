import {
  pipe,
} from 'fp-ts/function';
import {
  fromEvent,
  merge,
  Observable,
  map,
} from 'rxjs';

export default (video: HTMLVideoElement): Observable<boolean> => merge(
  pipe(
    fromEvent(video, 'playing'),
    map(() => true),
  ),
  pipe(
    fromEvent(video, 'waiting'),
    map(() => false),
  ),
  pipe(
    fromEvent(video, 'pause'),
    map(() => false),
  ),
);
