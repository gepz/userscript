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
import colorNode from '@/settingUI/colorNode';
import mapSettingNodes from '@/settingUI/mapSettingNodes';
import numberNode from '@/settingUI/numberNode';
import selectFontNode from '@/settingUI/selectFontNode';
import textColorNode from '@/settingUI/textColorNode';

const chatAppearancePanel: (
  c: AppCommander,
) => (
  s: SettingState,
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
        checkboxNode('displayModName'),
        checkboxNode('displaySuperChatAuthor'),
        checkboxNode('textOnly'),
      ],
      mapSettingNodes((x) => h('div', {
        style: panelBoxStyle(212),
      }, x)),
    ),
  ],
  mapSettingNodes(identity),
);

export default chatAppearancePanel;
