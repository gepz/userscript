import {
  Observable,
  map,
  pluck,
} from 'rxjs';
import {
  z,
} from 'zod';

export default (
  event$: Observable<InputEvent>,
): Observable<string> => event$.pipe(
  pluck('currentTarget'),
  map((x) => z.instanceof(HTMLInputElement).parse(x)),
  pluck('value'),
);
