import * as RA from 'fp-ts/ReadonlyArray';
import {
  pipe,
} from 'fp-ts/function';
import * as N from 'fp-ts/number';
import {
  h,
  text,
  VNode,
} from 'hyperapp';

import SettingConfig from '@/SettingConfig';
import SettingState from '@/SettingState';
import getText from '@/getText';
import buttonNode from '@/settingUI/buttonNode';
import getState from '@/settingUI/getState';
import updateAt from '@/settingUI/updateAt';
import panelBoxStyle from '@/ui/panelBoxStyle';
import tabContainer from '@/ui/tabContainer';

export default (c: SettingConfig): VNode<SettingState>[] => pipe(
  Math.trunc((
    getState<readonly string[]>('eventLog')(c.state).length
  ) / 100) + 1,
  (logPageLength) => [
    h('div', {
      style: panelBoxStyle(644),
    }, [
      h('div', {
        style: {
          float: 'right',
        },
      }, h('a', {
        style: {
          color: '#f0f',
        },
        // eslint-disable-next-line max-len
        href: 'https://greasyfork.org/en/scripts/411442-flow-youtube-chat/feedback',
        target: '_blank',
      }, text(getText('giveFeedback')(c.state.lang)))),
      h('div', {}, [
        h('span', {}, text(getText('eventLog')(c.state.lang))),
        buttonNode('copy')(c),
        tabContainer<SettingState>({
          container: {
            height: '276px',
          },
          label: {
            padding: '4px',
            width: '2em',
            textAlign: 'center',
          },
          labelFocus: {
            background: '#666',
          },
          tab: {
            display: 'flex',
            flexDirection: 'column',
            padding: '6px',
          },
        })((s, n) => updateAt('logTab', n)(c))(pipe(
          RA.makeBy(logPageLength, N.Show.show),
        ))(pipe(
          RA.makeBy(
            logPageLength,
            (i) => () => pipe(
              getState<readonly string[]>('eventLog')(
                c.state,
              ).slice(i * 100, (i + 1) * 100),
              RA.mapWithIndex((j, x) => h('div', {
                style: {
                  display: 'flex',
                },
              }, [
                h('div', {
                  style: {
                    userSelect: 'none',
                    flex: '0 0 2em',
                  },
                }, text((i * 100) + j)),
                h('div', {
                  style: {
                    background: j % 2 === 0 ? '#fff'
                    : '#ddd',
                    color: '#000',
                    flex: 'auto',
                    wordBreak: 'break-all',
                    padding: '0 2px',
                  },
                }, text(x)),
              ])),
            ),
          ),
        ))(getState<number>('logTab')(c.state)),
      ]),
    ]),
  ],
);
