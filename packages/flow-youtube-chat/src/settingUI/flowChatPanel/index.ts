import panelBoxStyle from '@userscript/ui/panelBoxStyle';
import {
  identity,
  pipe,
} from 'effect/Function';
import {
  h,
  text,
  VNode,
} from 'hyperapp';

import AppCommander from '@/AppCommander';
import SettingState from '@/SettingState';
import getText from '@/getText';
import buttonNode from '@/settingUI/buttonNode';
import checkboxNode from '@/settingUI/checkboxNode';
import colorNode from '@/settingUI/colorNode';
import intNode from '@/settingUI/intNode';
import mapSettingNodes from '@/settingUI/mapSettingNodes';
import numberNode from '@/settingUI/numberNode';
import selectFontNode from '@/settingUI/selectFontNode';
import stepTimingNode from '@/settingUI/stepTimingNode';
import textColorNode from '@/settingUI/textColorNode';

const flowChatPanel: (
  c: AppCommander
) => (
  s: SettingState
) => readonly VNode<SettingState>[] = pipe(
  [
    pipe(
      [
        selectFontNode,
        textColorNode('color'),
        textColorNode('ownerColor'),
        textColorNode('moderatorColor'),
        textColorNode('memberColor'),
        colorNode('shadowColor'),
      ],
      mapSettingNodes((x) => h('div', {
        style: panelBoxStyle(212),
      }, x)),
    ),
    pipe(
      [
        numberNode('chatOpacity', 0, 1, 0.05),
        numberNode('fontSize', 0.3, 2, 0.05),
        numberNode('fontWeight', 10, 1e3, 10),
        numberNode('shadowFontWeight', 0, 3, 0.1),
        numberNode('flowSpeed', 1, 50, 1),
        intNode('maxChatCount', 5, 200, 5),
        intNode('maxChatLength', 5, 200, 5),
        intNode('laneCount', 1, 25, 1),
      ],
      mapSettingNodes((x) => h('div', {
        style: panelBoxStyle(212),
      }, x)),
    ),
    pipe(
      [
        numberNode('flowY1', 0, 0.95, 0.01),
        numberNode('flowY2', 0.05, 1, 0.01),
        numberNode('flowX1', 0, 0.95, 0.01),
        numberNode('flowX2', 0.05, 1, 0.01),
        numberNode('minSpacing', 0, 2.5, 0.1),
        stepTimingNode,
        checkboxNode('createChats'),
        checkboxNode('displayModName'),
        checkboxNode('displaySuperChatAuthor'),
        checkboxNode('textOnly'),
        () => (s: SettingState) => text(getText('flowNewChatIf')(s)),
        checkboxNode('noOverlap'),
        // ...pipe(
        //   state.displayMatrix,
        //   A.map(A.map((y) => h<SettingState>('span', {
        //     style: {
        //       background: y ? '#000' : '#333',
        //       color: y ? '#fff' : '#999',
        //     },
        //   }, text(y)))),
        //   A.map((x) => h('div', {
        //     style: {
        //       display: 'grid',
        //       gridTemplateColumns: '1fr 1fr 1fr',
        //     },
        //   }, x)),
        // ),
        buttonNode('clearFlowChats'),
      ],
      mapSettingNodes((x) => h('div', {
        style: panelBoxStyle(212),
      }, x)),
    ),
  ],
  mapSettingNodes(identity),
);

export default flowChatPanel;
