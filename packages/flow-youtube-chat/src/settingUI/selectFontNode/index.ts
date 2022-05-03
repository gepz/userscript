import * as O from 'fp-ts/Option';
import * as RA from 'fp-ts/ReadonlyArray';
import {
  pipe,
} from 'fp-ts/function';
import {
  h,
  VNode,
} from 'hyperapp';

import SettingConfig from '@/SettingConfig';
import SettingState from '@/SettingState';
import fonts from '@/fonts';
import getText from '@/getText';
import languages from '@/languages';
import textRowStyle from '@/settingUI/textRowStyle';
import updateString from '@/settingUI/updateString';
import option from '@/ui/option';
import settingRow from '@/ui/settingRow';

export default (
  c: SettingConfig,
): VNode<SettingState> => settingRow(getText('font')(c.state.lang), [
  h('select', {
    style: textRowStyle,
    onchange: updateString('font')(c),
  }, pipe(
    fonts(c.state.font),
    RA.findIndex((x) => x[0] === c.state.font),
    O.getOrElse(() => 0),
    (index) => pipe(
      fonts(c.state.font),
      RA.mapWithIndex((i, font) => option(
        font[0],
        pipe(
          languages,
          RA.findIndex((x) => x === c.state.lang),
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
    value: c.state.font,
    oninput: updateString('font')(c),
  }),
]);
