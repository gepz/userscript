import * as R from 'fp-ts/Reader';
import {
  h,
  VNode,
} from 'hyperapp';

import AppCommander from '@/AppCommander';
import SettingState from '@/SettingState';
import checkboxNode from '@/settingUI/checkboxNode';
import getState from '@/settingUI/getState';
import intNode from '@/settingUI/intNode';

export default (
  c: AppCommander,
): R.Reader<SettingState, VNode<SettingState>> => (
  s,
) => h('div', {}, [
  checkboxNode('useStepTiming')(c)(s),
  h('div', {
    style: {
      ...(getState<boolean>('useStepTiming')(s) ? {}
      : {
        opacity: '0.5',
      }),
    },
  }, intNode('timingStepCount', 1, 400, 1)(c)(s)),
]);
