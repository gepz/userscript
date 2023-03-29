import {
  pipe,
} from '@effect/data/Function';
import * as RA from '@effect/data/ReadonlyArray';
import * as R from 'fp-ts/Reader';
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
      (xs) => (c: AppCommander) => (s: SettingState) => pipe(
        xs,
        RA.map((x) => x(c)(s)),
        (x) => h('div', {
          style: panelBoxStyle(644),
        }, x),
      ),
    ),
  ],
  (xs) => (c: AppCommander) => (s: SettingState) => pipe(
    xs,
    RA.map((x) => x(c)(s)),
  ),
);

export default chatFieldPanel;
