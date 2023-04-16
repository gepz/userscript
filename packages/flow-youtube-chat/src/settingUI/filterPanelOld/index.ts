import panelBoxStyle from '@userscript/ui/panelBoxStyle';
import setEditRegexes from '@userscript/ui/setter/setEditRegexes';
import setEditStrings from '@userscript/ui/setter/setEditStrings';
import {
  h,
  VNode,
} from 'hyperapp';

import AppCommander from '@/AppCommander';
import SettingState from '@/SettingState';
import textAreaNode from '@/settingUI/textAreaNode';

export default (
  c: AppCommander,
) => (
  s: SettingState,
): readonly VNode<SettingState>[] => ([
  h('div', {
    style: panelBoxStyle(212),
  }, textAreaNode(setEditStrings)('bannedWords', 18)(c)(s)),
  h('div', {
    style: panelBoxStyle(212),
  }, textAreaNode(setEditRegexes)('bannedWordRegexes', 18)(c)(s)),
  h('div', {
    style: panelBoxStyle(212),
  }, textAreaNode(setEditStrings)('bannedUsers', 18)(c)(s)),
]);
