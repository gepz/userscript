import {
  h,
  VNode,
} from 'hyperapp';

import SettingConfig from '@/SettingConfig';
import SettingState from '@/SettingState';
import checkboxNode from '@/settingUI/checkboxNode';
import getState from '@/settingUI/getState';
import intNode from '@/settingUI/intNode';

export default (
  c: SettingConfig,
): VNode<SettingState> => h('div', {}, [
  checkboxNode('useStepTiming')(c),
  h('div', {
    style: {
      ...(getState<boolean>('useStepTiming')(c.state) ? {}
      : {
        opacity: '0.5',
      }),
    },
  }, intNode('timingStepCount', 1, 400, 1)(c)),
]);
