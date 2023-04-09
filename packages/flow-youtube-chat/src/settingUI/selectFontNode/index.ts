import {
  pipe,
} from '@effect/data/Function';
import * as O from '@effect/data/Option';
import * as RA from '@effect/data/ReadonlyArray';
import * as Ed from '@userscript/ui/Editable';
import option from '@userscript/ui/option';
import setEditString from '@userscript/ui/setEditString';
import settingRow from '@userscript/ui/settingRow';
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
import textRowStyle from '@/settingUI/textRowStyle';
import updateInput from '@/settingUI/updateInput';

export default (
  c: AppCommander,
): (s: SettingState) => VNode<SettingState> => (
  s,
) => pipe(
  Ed.value(s.font),
  (font) => settingRow(getText('font')(s.lang), '', [
    h('select', {
      style: textRowStyle,
      onchange: updateInput(setEditString(false))('font')(c),
    }, pipe(
      fonts(font),
      RA.findFirstIndex((x) => x[0] === font),
      O.getOrElse(() => 0),
      (index) => pipe(
        fonts(font),
        RA.map((f, i) => option(
          f[0],
          pipe(
            languages,
            RA.findFirstIndex((x) => x === s.lang),
            O.map((x) => RA.unsafeGet(x + 1)(f)),
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
