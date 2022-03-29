import {
  h,
} from 'hyperapp';

import AppCommander from '@/AppCommander';
import RootComponent from '@/RootComponent';
import SettingState from '@/SettingState';
import settingPanel from '@/settingPanel';
import toggleSettingPanelButton from '@/toggleSettingPanelButton';

export default (
  command: AppCommander,
): RootComponent<SettingState> => {
  const tag = 'span';
  const panel = settingPanel(command);
  return {
    tag,
    view: (s) => h(tag, {
      style: {
        display: 'contents',
      },
    }, [
      panel(s),
      toggleSettingPanelButton(s),
    ]),
  };
};
