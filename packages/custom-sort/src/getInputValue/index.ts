import {
  tapIs,
} from '@userscript/tap';
import {
  Observable,
  map,
  pluck,
} from 'rxjs';

export default (
  event$: Observable<InputEvent>,
): Observable<string> => event$.pipe(
  pluck('currentTarget'),
  map(tapIs(HTMLInputElement)),
  pluck('value'),
);
