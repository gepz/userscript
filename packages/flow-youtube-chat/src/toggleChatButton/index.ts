import {
  pipe,
} from 'fp-ts/function';
import {
  h,
} from 'hyperapp';

import RootComponent from '@/RootComponent';
import UserConfigSetter from '@/UserConfigSetter';
import getText from '@/getText';

type State = {
  displayChats: boolean,
  lang: string,
};

export default (setConfig: UserConfigSetter): RootComponent<State> => pipe(
  'button',
  (tag: keyof HTMLElementTagNameMap) => ({
    tag,
    view: (state) => pipe(
      getText(
        state.displayChats ? 'hideChat' : 'showChat',
      )(state.lang),
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
          width: '3em',
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
            [() => setConfig.displayChats(displayChats), undefined],
          ],
        ),
      }, [
        h('svg', {
          style: {
            width: '100%',
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
    ),
  }),
);
