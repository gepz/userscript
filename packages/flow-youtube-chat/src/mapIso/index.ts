import * as F from 'fp-ts/Functor';
import {
  Kind,
  URIS,
} from 'fp-ts/HKT';
import * as Iso from 'monocle-ts/Iso';

export default <URI extends URIS>(
  f: F.Functor1<URI>,
) => <T1, T2>(iso: Iso.Iso<T1, T2>) => Iso.iso<
Kind<URI, T1>,
Kind<URI, T2>
>(
  (x) => f.map(x, iso.get),
  (x) => f.map(x, iso.reverseGet),
);
