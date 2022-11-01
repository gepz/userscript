import {
  pipe,
} from 'fp-ts/function';
import {
  h,
} from 'hyperapp';

import AppCommander from '@/AppCommander';
import RootComponent from '@/RootComponent';
import SettingState from '@/SettingState';
import makeRootComponent from '@/makeRootComponent';
import settingsPanel from '@/settingsPanel';

export default (
  command: AppCommander,
): RootComponent<SettingState> => pipe(
  settingsPanel(command),
  (panel) => makeRootComponent((tag) => (s: SettingState) => h(tag, {
    style: {
      position: 'absolute',
    },
  }, panel(s)))('span'),
);
