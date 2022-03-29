import {
  pipe,
} from 'fp-ts/function';
import {
  fromEvent,
  merge,
  Observable,
  mapTo,
} from 'rxjs';

export default (video: HTMLVideoElement): Observable<boolean> => merge(
  pipe(
    fromEvent(video, 'playing'),
    mapTo(true),
  ),
  pipe(
    fromEvent(video, 'waiting'),
    mapTo(false),
  ),
  pipe(
    fromEvent(video, 'pause'),
    mapTo(false),
  ),
);
