import RootComponent, {
  makeComponent,
} from '@userscript/ui/RootComponent';
import {
  pipe,
} from 'effect/Function';
import {
  h,
} from 'hyperapp';

import AppCommander from '@/AppCommander';
import SettingState from '@/SettingState';
import settingsPanel from '@/settingsPanel';

export default (
  command: AppCommander,
): RootComponent<SettingState> => pipe(
  settingsPanel(command),
  (panel) => makeComponent((tag) => (s: SettingState) => h(tag, {
    style: {
      display: 'contents',
    },
  }, panel(s)))('span'),
);
