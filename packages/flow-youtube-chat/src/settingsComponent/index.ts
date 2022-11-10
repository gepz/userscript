import {
  pipe,
} from 'fp-ts/function';
import {
  h,
} from 'hyperapp';

import AppCommander from '@/AppCommander';
import RootComponent, {
  makeComponent,
} from '@/RootComponent';
import SettingState from '@/SettingState';
import settingsPanel from '@/settingsPanel';

export default (
  command: AppCommander,
): RootComponent<SettingState> => pipe(
  settingsPanel(command),
  (panel) => makeComponent((tag) => (s: SettingState) => h(tag, {
    style: {
      position: 'absolute',
    },
  }, panel(s)))('span'),
);
