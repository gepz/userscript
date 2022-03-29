import partial from '@userscript/partial';
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
  map(partial(tapIs, HTMLInputElement)),
  pluck('value'),
);
