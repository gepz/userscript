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
import editAction from '@/settingUI/editAction';
import setEditString from '@/settingUI/setEditString';
import textRowStyle from '@/settingUI/textRowStyle';
import updateInput from '@/settingUI/updateInput';
import * as Ed from '@/ui/Editable';
import option from '@/ui/option';
import settingRow from '@/ui/settingRow';

export default (
  c: AppCommander,
): R.Reader<SettingState, VNode<SettingState>> => (
  s,
) => pipe(
  Ed.value(s.font),
  (font) => settingRow(getText('font')(s.lang), '', [
    h('select', {
      style: textRowStyle,
      onchange: updateInput(setEditString(false))('font')(c),
    }, pipe(
      fonts(font),
      RA.findIndex((x) => x[0] === font),
      O.getOrElse(() => 0),
      (index) => pipe(
        fonts(font),
        RA.mapWithIndex((i, f) => option(
          f[0],
          pipe(
            languages,
            RA.findIndex((x) => x === s.lang),
            O.map((x) => f[x + 1]),
            O.getOrElse(() => 'Error'),
          ),
          i === index,
        )),
      ),
    )),
    h('input', {
      style: textRowStyle,
      maxlength: 20,
      value: font,
      ...editAction('font', setEditString),
    }),
  ]),
);
