import * as R from 'fp-ts/Reader';
import {
  h,
  text,
  VNode,
} from 'hyperapp';

import AppCommander from '@/AppCommander';
import SettingState from '@/SettingState';
import getText from '@/getText';
import editAction from '@/settingUI/editAction';
import getEditValue from '@/settingUI/getEditValue';
import textAreaNode from '@/settingUI/textAreaNode';
import updateStrings from '@/settingUI/updateStrings';
import panelBoxStyle from '@/ui/panelBoxStyle';
import settingRow from '@/ui/settingRow';
import textAreaRow from '@/ui/textAreaRow';

export default (c: AppCommander): R.Reader<
SettingState,
VNode<SettingState>[]
> => (s) => [
  h('div', {
    style: panelBoxStyle(212),
  }, textAreaNode('bannedWords', 18)(c)(s)),
  h('div', {
    style: panelBoxStyle(212),
  }, settingRow(getText('bannedWordRegexs')(s.lang), [
    h('span', {}, text(s.bannedWordRegexsValid ? ''
    : `${getText('error')(s.lang)}: ${
      s.bannedWordRegexsError
    }`)),
    textAreaRow(
      18,
      getEditValue<readonly string[]>(
        'bannedWordRegexs',
        (x) => x.join('\n'),
      )(s),
      editAction(
        'bannedWordRegexs',
        updateStrings,
      )(c),
    ),
  ])),
  h('div', {
    style: panelBoxStyle(212),
  }, textAreaNode('bannedUsers', 18)(c)(s)),
];
