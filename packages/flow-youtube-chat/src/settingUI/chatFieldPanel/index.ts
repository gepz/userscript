import panelBoxStyle from '@userscript/ui/panelBoxStyle';
import {
  identity,
  pipe,
} from 'effect/Function';
import {
  h,
  VNode,
} from 'hyperapp';

import AppCommander from '@/AppCommander';
import SettingState from '@/SettingState';
import checkboxNode from '@/settingUI/checkboxNode';
import mapSettingNodes from '@/settingUI/mapSettingNodes';
import numberNode from '@/settingUI/numberNode';

const chatFieldPanel: (
  c: AppCommander
) => (
  s: SettingState
) => readonly VNode<SettingState>[] = pipe(
  [
    pipe(
      [
        numberNode('fieldScale', 0.7, 1.5, 0.05),
        checkboxNode('simplifyChatField'),
        checkboxNode('createBanButton'),
      ],
      mapSettingNodes((x) => h('div', {
        style: panelBoxStyle(644),
      }, x)),
    ),
  ],
  mapSettingNodes(identity),
);

export default chatFieldPanel;
