import panelBoxStyle from '@userscript/ui/panelBoxStyle';
import setEditRegexs from '@userscript/ui/setEditRegexs';
import setEditStrings from '@userscript/ui/setEditStrings';
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
    'bannedWordRegexs',
    18,
    setEditRegexs,
  )(c)(s)),
  h('div', {
    style: panelBoxStyle(212),
  }, textAreaNode(
    'bannedUsers',
    18,
    setEditStrings,
  )(c)(s)),
]);
