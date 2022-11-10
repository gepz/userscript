import {
  flow,
} from 'fp-ts/function';
import {
  h,
} from 'hyperapp';

import RootComponent, {
  makeComponent,
} from '@/RootComponent';
import SettingState from '@/SettingState';
import toggleSettingsPanelButton from '@/toggleSettingsPanelButton';

export default flow(
  toggleSettingsPanelButton,
  (button): RootComponent<SettingState> => makeComponent(
    (tag) => (s: SettingState) => h(tag, {
      style: {
        display: 'flex',
      },
    }, button(s)),
  )('span'),
);
