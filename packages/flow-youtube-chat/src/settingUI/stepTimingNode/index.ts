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
) => (
  s: SettingState,
): VNode<SettingState> => h('div', {}, [
  checkboxNode('useStepTiming')(c)(s),
  h('div', {
    style: {
      opacity: getState('useStepTiming')(s) ? undefined
      : '0.5',
    },
  }, intNode('timingStepCount', 1, 400, 1)(c)(s)),
]);
