import {
  pipe,
} from '@effect/data/Function';
import * as Z from '@effect/io/Effect';
import forwardTo from '@userscript/forward-to';
import {
  Subject,
} from 'rxjs';

export default <T, T2>(
  con: new (x: (a: T2) => void) => T,
): Z.Effect<never, never, {
  subject: Subject<T2>;
  observer: T;
}> => pipe(
  Z.Do(),
  Z.bindDiscard('subject', Z.sync(() => new Subject<T2>())),
  // eslint-disable-next-line new-cap
  Z.bind('observer', (x) => Z.sync(() => new con(forwardTo(x.subject)))),
);
