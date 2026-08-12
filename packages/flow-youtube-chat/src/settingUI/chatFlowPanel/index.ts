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
import buttonNode from '@/settingUI/buttonNode';
import flowConditionsNode from '@/settingUI/flowConditionsNode';
import intNode from '@/settingUI/intNode';
import laneToggleNode from '@/settingUI/laneToggleNode';
import mapSettingNodes from '@/settingUI/mapSettingNodes';
import numberNode from '@/settingUI/numberNode';
import stepTimingNode from '@/settingUI/stepTimingNode';

const chatFlowPanel: (
  c: AppCommander,
) => (
  s: SettingState,
) => readonly VNode<SettingState>[] = pipe(
  [
    pipe(
      [
        numberNode('flowSpeed', 1, 50, 1),
        intNode('maxChatCount', 5, 200, 5),
        intNode('maxChatLength', 5, 200, 5),
        stepTimingNode,
        flowConditionsNode,
        buttonNode('clearFlowChats'),
      ],
      mapSettingNodes((x) => h('div', {
        style: panelBoxStyle(212),
      }, x)),
    ),
    pipe(
      [
        intNode('laneCount', 1, 25, 1),
        laneToggleNode,
        numberNode('flowY1', 0, 0.95, 0.01),
        numberNode('flowY2', 0.05, 1, 0.01),
        numberNode('flowX1', 0, 0.95, 0.01),
        numberNode('flowX2', 0.05, 1, 0.01),
        numberNode('minSpacing', 0, 2.5, 0.1),
      ],
      mapSettingNodes((x) => h('div', {
        style: panelBoxStyle(212),
      }, x)),
    ),
  ],
  mapSettingNodes(identity),
);

export default chatFlowPanel;
