import {
  tapIs,
} from '@userscript/tap';
import * as IO from 'fp-ts/IO';
import * as R from 'fp-ts/Reader';
import {
  flow,
  pipe,
} from 'fp-ts/function';
import {
  VNode,
  h,
  text,
  Effect,
  Dispatchable,
} from 'hyperapp';

import SettingState from '@/SettingState';
import getText from '@/getText';

const togglePanel = (
  syncSettingState: R.Reader<Dispatchable<SettingState>, IO.IO<void>>,
) => (x: SettingState, e: MouseEvent): [
  s: SettingState,
  ...e: Effect<SettingState>[],
] => pipe(
  {
    ...x,
    showPanel: !x.showPanel,
  },
  (newState) => [
    newState,
    x.showPanel ? () => tapIs(HTMLElement)(e.currentTarget).blur()
    : () => {},
    syncSettingState(newState),
  ],
);

export default flow(
  togglePanel,
  (toggle) => (
    state: SettingState,
  ): VNode<SettingState> => h('button', {
    class: 'fyc_button',
    style: {
      background: 'rgba(0,0,0,0)',
      marginLeft: '10px',
      whiteSpace: 'nowrap',
    },
    onclick: toggle,
  }, [
    h('svg', {
      preserveAspectRatio: 'xMidYMid meet',
      viewBox: '0 0 640 640',
      width: '15',
      height: '15',
      style: {
        position: 'relative',
        top: '1px',
      },
    }, [
      h('defs', {}, h('path', {
        id: 'd1TbzTC1zI',
        // eslint-disable-next-line max-len
        d: 'M135 58c25 14 67 30 82 35-7 49 16 109-15 149-50 71-19 184 64 213 74 31 165-18 183-95-3-38 23-62 58-36l120 55c-39 10-106 35-72 85 40 38 1 71-29 98-29 53-70-17-109-5-46 22-25 109-96 85h-55c-24-31-21-103-80-84-32 32-70 31-93-9l-35-36c4-40 57-96-6-120-45 5-58-32-52-68 2-19-4-41 3-59 35-15 100-22 77-79-48-43 1-84 35-115 5-6 12-12 20-14zM577 2c52 3 72 62 62 106-5 51 19 117-27 155-18 24 8 49 11 74-39-8-98-46-146-60-55-1-111 2-167-2-52-15-57-76-52-121S242 52 282 18c38-30 88-11 132-16h163z',
      })),
      h('use', {
        href: '#d1TbzTC1zI',
        opacity: '1',
        fill: 'var(--iron-icon-fill-color, currentcolor)',
        'fill-opacity': '1',
      }),
    ]),
    h('span', {
      style: {
        position: 'relative',
        top: '-2px',
        marginLeft: '8px,',
      },
    }, text(getText('setting')(state.lang))),
  ]),
);
