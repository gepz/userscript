import {
  h,
} from 'hyperapp';

import AppCommander from '@/AppCommander';
import RootComponent from '@/RootComponent';
import SettingState from '@/SettingState';
import settingsPanel from '@/settingsPanel';
import toggleSettingsPanelButton from '@/toggleSettingsPanelButton';

export default (
  command: AppCommander,
): RootComponent<SettingState> => {
  const tag = 'span';
  const panel = settingsPanel(command);
  return {
    tag,
    view: (s) => h(tag, {
      style: {
        display: 'flex',
        position: 'relative',
      },
    }, [
      panel(s),
      toggleSettingsPanelButton(s),
    ]),
  };
};
