import {
  h,
  text,
  VNode,
} from 'hyperapp';

import SettingConfig from '@/SettingConfig';
import SettingState from '@/SettingState';
import getText from '@/getText';
import editAction from '@/settingUI/editAction';
import getEditValue from '@/settingUI/getEditValue';
import textAreaNode from '@/settingUI/textAreaNode';
import updateStrings from '@/settingUI/updateStrings';
import panelBoxStyle from '@/ui/panelBoxStyle';
import settingRow from '@/ui/settingRow';
import textAreaRow from '@/ui/textAreaRow';

export default (c: SettingConfig): VNode<SettingState>[] => [
  h('div', {
    style: panelBoxStyle(212),
  }, textAreaNode('bannedWords', 18)(c)),
  h('div', {
    style: panelBoxStyle(212),
  }, settingRow(getText('bannedWordRegexs')(c.state.lang), [
    h('span', {}, text(c.state.bannedWordRegexsValid ? ''
    : `${getText('error')(c.state.lang)}: ${
      c.state.bannedWordRegexsError
    }`)),
    textAreaRow(
      18,
      getEditValue<readonly string[]>(
        'bannedWordRegexs',
        (x) => x.join('\n'),
      )(c.state),
      editAction(
        'bannedWordRegexs',
        updateStrings,
      )(c),
    ),
  ])),
  h('div', {
    style: panelBoxStyle(212),
  }, textAreaNode('bannedUsers', 18)(c)),
];
