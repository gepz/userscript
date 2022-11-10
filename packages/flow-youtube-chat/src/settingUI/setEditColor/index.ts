import * as En from 'fp-ts/Endomorphism';
import * as O from 'fp-ts/Option';
import * as RTu from 'fp-ts/ReadonlyTuple';
import {
  constant,
} from 'fp-ts/function';

import Editable, * as Ed from '@/ui/Editable';
import validColor from '@/validColor';

export default (
  editing: boolean,
) => (
  value: string,
): En.Endomorphism<Editable<string>> => (editing
  ? (validColor(value)
    ? constant(Ed.fromValueText(value)(value))
    : Ed.setText(value))
  : (validColor(value)
    ? constant(Ed.of(value))
    : RTu.mapSnd(constant(O.of([value, O.of('')])))));
