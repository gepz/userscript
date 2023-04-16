import {
  pipe,
} from '@effect/data/Function';
import * as Z from '@effect/io/Effect';
import {
  h,
} from 'hyperapp';

import RootComponent, {
  makeComponent,
} from '@/RootComponent';
import UserConfigSetter from '@/UserConfigSetter';
import getText from '@/getText';
import languages from '@/languages';

type State = {
  displayChats: boolean,
  lang: typeof languages[number],
};

export default (setConfig: UserConfigSetter): RootComponent<State> => pipe(
  'button',
  makeComponent((tag) => (state: State) => pipe(
    getText(
      state.displayChats ? 'hideChats' : 'showChats',
    )(state),
    (label) => h(tag, {
      class: 'ytp-button',
      style: {
        background: 'none',
        border: 'none',
        cursor: 'pointer',
        float: 'left',
        fontSize: '1em',
        height: '4em',
        outline: 'none',
        overflow: 'visible',
        padding: '0 0 0em',
        position: 'relative',
        width: '48px',
        display: 'flex',
        alignItems: 'center',
      },
      type: 'button',
      'aria-label': label,
      title: label,
      onclick: (s: State) => pipe(
        !s.displayChats,
        (displayChats) => [
          {
            ...s,
            displayChats,
          },
          () => Z.runPromise(setConfig.displayChats(displayChats)),
        ],
      ),
    }, [
      h('svg', {
        style: {
          width: '36px',
        },
        viewBox: '0 0 36 36',
      }, [
        h('path', {
          class: 'chat-button-path',
          d: 'm11 12h17q1 0 1 1v9q0 1-1 1h-1v2l-4-2h-12q-1 0-1-1v-9q0-1 1-1z',
          fill: '#fff',
          'fill-opacity': state.displayChats ? '1' : '0',
          stroke: '#fff',
          'stroke-width': '2',
        }),
      ]),
    ]),
  )),
);
