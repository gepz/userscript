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
  }, textAreaNode(
    'bannedWords',
    18,
    setEditStrings,
  )(c)(s)),
  h('div', {
    style: panelBoxStyle(212),
  }, textAreaNode(
    'bannedWordRegexes',
    18,
    setEditRegexes,
  )(c)(s)),
  h('div', {
    style: panelBoxStyle(212),
  }, textAreaNode(
    'bannedUsers',
    18,
    setEditStrings,
  )(c)(s)),
]);
