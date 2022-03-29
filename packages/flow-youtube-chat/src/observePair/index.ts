import forwardTo from '@userscript/forward-to';
import * as IO from 'fp-ts/IO';
import {
  pipe,
} from 'fp-ts/function';
import {
  Subject,
} from 'rxjs';

export default <T, T2>(con: new (x: (a: T2) => void) => T): IO.IO<{
  subject: Subject<T2>;
  observer: T;
}> => pipe(
  () => new Subject<T2>(),
  IO.bindTo('subject'),
  // eslint-disable-next-line new-cap
  IO.bind('observer', (x) => () => new con(forwardTo(x.subject))),
);
