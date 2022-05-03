import * as RA from 'fp-ts/ReadonlyArray';
import {
  apply,
  pipe,
} from 'fp-ts/function';
import {
  h,
  VNode,
} from 'hyperapp';

import SettingConfig from '@/SettingConfig';
import SettingState from '@/SettingState';
import checkboxNode from '@/settingUI/checkboxNode';
import numberNode from '@/settingUI/numberNode';
import panelBoxStyle from '@/ui/panelBoxStyle';

export default (c: SettingConfig): VNode<SettingState>[] => [
  h('div', {
    style: panelBoxStyle(644),
  }, pipe(
    [
      numberNode('fieldScale', 0.7, 1.5, 0.05),
      checkboxNode('simplifyChatField'),
      checkboxNode('createBanButton'),
    ],
    RA.map(apply(c)),
  )),
];
