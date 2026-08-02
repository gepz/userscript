import {
  h,
  text,
  VNode,
} from 'hyperapp';

import AppCommander from '@/AppCommander';
import SettingState from '@/SettingState';
import getText from '@/getText';
import checkboxNode from '@/settingUI/checkboxNode';
import getState from '@/settingUI/getState';

// Dim-only, like stepTimingNode: the conditions stay editable while
// createChats is off, so they can be staged before flow is re-enabled.
export default (
  c: AppCommander,
) => (
  s: SettingState,
): VNode<SettingState> => h('div', {}, [
  checkboxNode('createChats')(c)(s),
  h('div', {
    style: {
      paddingLeft: '10px',
      opacity: getState('createChats')(s)
        ? null
        : '0.5',
    },
  }, [
    text(getText('flowNewChatIf')(s)),
    checkboxNode('noOverlap')(c)(s),
    checkboxNode('noRepeatedContent')(c)(s),
  ]),
]);
