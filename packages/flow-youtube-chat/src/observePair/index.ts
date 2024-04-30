import forwardTo from '@userscript/forward-to';
import {
  Effect as Z,
} from 'effect';
import {
  Subject,
} from 'rxjs';

export default <T, T2>(
  con: new (x: (a: T2) => void) => T,
): Z.Effect<{
  subject: Subject<T2>;
  observer: T;
}> => Z.sync(() => {
  const subject = new Subject<T2>();
  return {
    subject,
    // eslint-disable-next-line new-cap
    observer: new con(forwardTo(subject)),
  };
});
