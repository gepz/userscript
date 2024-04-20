import * as Ed from '@userscript/ui/Editable';
import option from '@userscript/ui/node/option';
import settingRow from '@userscript/ui/node/settingRow';
import setEditString from '@userscript/ui/setter/setEditString';
import {
  pipe,
} from 'effect/Function';
import * as O from 'effect/Option';
import * as A from 'effect/Array';
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
  (font) => settingRow(getText('font')(s), '', [
    h('select', {
      style: textRowStyle,
      onchange: updateInput('font')(setEditString(false))(c),
    }, pipe(
      fonts(font),
      A.findFirstIndex((x) => x[0] === font),
      O.getOrElse(() => 0),
      (index) => pipe(
        fonts(font),
        A.map((f, i) => option(
          f[0],
          pipe(
            languages,
            A.findFirstIndex((x) => x === s.lang),
            O.map((x) => A.unsafeGet(x + 1)(f)),
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
