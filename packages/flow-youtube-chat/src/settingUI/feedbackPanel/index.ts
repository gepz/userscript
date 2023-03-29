import {
  pipe,
} from '@effect/data/Function';
import * as RA from '@effect/data/ReadonlyArray';
import {
  h,
  text,
  VNode,
} from 'hyperapp';

import AppCommander from '@/AppCommander';
import Log from '@/Log';
import SettingState from '@/SettingState';
import getText from '@/getText';
import buttonNode from '@/settingUI/buttonNode';
import getState from '@/settingUI/getState';
import updateAt from '@/settingUI/updateAt';
import panelBoxStyle from '@/ui/panelBoxStyle';
import tabContainer from '@/ui/tabContainer';

export default (
  c: AppCommander,
) => (
  s: SettingState,
): readonly VNode<SettingState>[] => pipe(
  Math.trunc((
    getState<Log>('eventLog')(s).entries.length
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
      }, text(getText('giveFeedback')(s.lang)))),
      h('div', {}, [
        h('span', {}, text(getText('eventLog')(s.lang))),
        buttonNode('copy')(c)(s),
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
        })((_, n) => updateAt('logTab')(n)(c))(pipe(
          RA.makeBy(logPageLength, (x) => `${x}`),
        ))(pipe(
          RA.makeBy(
            logPageLength,
            (i) => () => pipe(
              getState<Log>('eventLog')(
                s,
              ).entries.slice(i * 100, (i + 1) * 100),
              RA.map((x, j) => h('div', {
                style: {
                  display: 'flex',
                },
              }, [
                h('div', {
                  style: {
                    userSelect: 'none',
                    flex: '0 0 2em',
                  },
                }, text(x.id)),
                h('div', {
                  style: {
                    background: j % 2 === 0 ? '#fff'
                    : '#ddd',
                    color: '#000',
                    flex: 'auto',
                    wordBreak: 'break-all',
                    whiteSpace: 'pre-wrap',
                    padding: '0 2px',
                  },
                }, text(x.text)),
              ])),
            ),
          ),
        ))(getState<number>('logTab')(s)),
      ]),
    ]),
  ],
);
