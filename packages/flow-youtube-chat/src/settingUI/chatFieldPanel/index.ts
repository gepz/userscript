import * as R from 'fp-ts/Reader';
import * as RA from 'fp-ts/ReadonlyArray';
import {
  apply,
  pipe,
} from 'fp-ts/function';
import {
  h,
  VNode,
} from 'hyperapp';

import AppCommander from '@/AppCommander';
import SettingState from '@/SettingState';
import checkboxNode from '@/settingUI/checkboxNode';
import numberNode from '@/settingUI/numberNode';
import panelBoxStyle from '@/ui/panelBoxStyle';

const chatFieldPanel:R.Reader<
AppCommander,
R.Reader<SettingState, readonly VNode<SettingState>[]>
> = pipe(
  [
    pipe(
      [
        numberNode('fieldScale', 0.7, 1.5, 0.05),
        checkboxNode('simplifyChatField'),
        checkboxNode('createBanButton'),
      ],
      R.sequenceArray,
      R.map(R.sequenceArray),
      R.map(R.map((x) => h('div', {
        style: panelBoxStyle(644),
      }, x))),
    ),
  ],
  R.sequenceArray,
  R.map(R.sequenceArray),
);

export default chatFieldPanel;
