import {
  flow,
} from 'fp-ts/function';
import {
  h,
} from 'hyperapp';

import RootComponent from '@/RootComponent';
import SettingState from '@/SettingState';
import makeRootComponent from '@/makeRootComponent';
import toggleSettingsPanelButton from '@/toggleSettingsPanelButton';

export default flow(
  toggleSettingsPanelButton,
  (button): RootComponent<SettingState> => makeRootComponent(
    (tag) => (s: SettingState) => h(tag, {
      style: {
        display: 'flex',
      },
    }, button(s)),
  )('span'),
);
