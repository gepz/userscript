import panelBoxStyle from '@userscript/ui/panelBoxStyle';
import {
  h,
  VNode,
} from 'hyperapp';

import AppCommander from '@/AppCommander';
import SettingState from '@/SettingState';
import plainTextAreaNode from '@/settingUI/plainTextAreaNode';
import regexTextAreaNode from '@/settingUI/regexTextAreaNode';

export default (
  c: AppCommander,
) => (
  s: SettingState,
): readonly VNode<SettingState>[] => ([
  h('div', {
    style: panelBoxStyle(212),
  }, plainTextAreaNode('bannedWords', 18)(c)(s)),
  h('div', {
    style: panelBoxStyle(212),
  }, regexTextAreaNode('bannedWordRegexes', 18)(c)(s)),
  h('div', {
    style: panelBoxStyle(212),
  }, plainTextAreaNode('bannedUsers', 18)(c)(s)),
]);
