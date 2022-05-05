import * as O from 'fp-ts/Option';
import * as R from 'fp-ts/Reader';
import * as RA from 'fp-ts/ReadonlyArray';
import {
  pipe,
} from 'fp-ts/function';
import {
  h,
  VNode,
} from 'hyperapp';

import AppCommander from '@/AppCommander';
import SettingState from '@/SettingState';
import fonts from '@/fonts';
import getText from '@/getText';
import languages from '@/languages';
import textRowStyle from '@/settingUI/textRowStyle';
import updateString from '@/settingUI/updateString';
import option from '@/ui/option';
import settingRow from '@/ui/settingRow';

export default (
  c: AppCommander,
): R.Reader<SettingState, VNode<SettingState>> => (
  s,
) => settingRow(getText('font')(s.lang), [
  h('select', {
    style: textRowStyle,
    onchange: updateString('font')(c),
  }, pipe(
    fonts(s.font),
    RA.findIndex((x) => x[0] === s.font),
    O.getOrElse(() => 0),
    (index) => pipe(
      fonts(s.font),
      RA.mapWithIndex((i, font) => option(
        font[0],
        pipe(
          languages,
          RA.findIndex((x) => x === s.lang),
          O.map((x) => font[x + 1]),
          O.getOrElse(() => 'Error'),
        ),
        i === index,
      )),
    ),
  )),
  h('input', {
    style: textRowStyle,
    maxlength: 20,
    value: s.font,
    oninput: updateString('font')(c),
  }),
]);
