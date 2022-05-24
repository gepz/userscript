import * as R from 'fp-ts/Reader';
import {
  h,
  VNode,
} from 'hyperapp';

import AppCommander from '@/AppCommander';
import SettingState from '@/SettingState';
import setEditRegexs from '@/settingUI/setEditRegexs';
import setEditStrings from '@/settingUI/setEditStrings';
import textAreaNode from '@/settingUI/textAreaNode';
import panelBoxStyle from '@/ui/panelBoxStyle';

export default (c: AppCommander): R.Reader<
SettingState,
readonly VNode<SettingState>[]
> => (s) => [
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
];
