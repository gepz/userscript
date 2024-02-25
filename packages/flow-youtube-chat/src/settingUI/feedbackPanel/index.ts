import tabContainer from '@userscript/ui/node/tabContainer';
import panelBoxStyle from '@userscript/ui/panelBoxStyle';
import {
  pipe,
} from 'effect/Function';
import * as O from 'effect/Option';
import * as RA from 'effect/ReadonlyArray';
import {
  h,
  text,
  VNode,
} from 'hyperapp';

import AppCommander from '@/AppCommander';
import * as log from '@/Log';
import SettingState from '@/SettingState';
import getText from '@/getText';
import buttonNode from '@/settingUI/buttonNode';
import checkboxNode from '@/settingUI/checkboxNode';
import getState from '@/settingUI/getState';
import mapSettingNodes from '@/settingUI/mapSettingNodes';
import updateAt from '@/settingUI/updateAt';

export default (
  c: AppCommander,
) => (
  s: SettingState,
): readonly VNode<SettingState>[] => pipe(
  getState('eventLog')(s).compressedBlocks.length + 1,
  (logPageCount) => [
    pipe(
      [
        checkboxNode('logEvents'),
        buttonNode('importLog'),
      ],
      mapSettingNodes((x) => h('div', {
        style: panelBoxStyle(212),
      }, x)),
    )(c)(s),
    h('div', {
      style: panelBoxStyle(428),
    }, [
      h('a', {
        style: {
          color: '#f0f',
        },
        // eslint-disable-next-line max-len
        href: 'https://greasyfork.org/en/scripts/411442-flow-youtube-chat/feedback',
        target: '_blank',
      }, text(getText('giveFeedback')(s))),
      h('div', {}, [
        h('span', {}, text(getText('eventLog')(s))),
        buttonNode('copy')(c)(s),
        tabContainer<SettingState>({
          container: {},
          label: {
            padding: '4px',
            width: '2em',
            textAlign: 'center',
          },
          labelFocus: {
            background: '#666',
          },
          tab: {
            height: '251px',
            display: 'flex',
            flexDirection: 'column',
            padding: '6px',
          },
        })((_, n) => updateAt('logTab')(n)(c))(pipe(
          RA.makeBy(logPageCount, (x) => `${x}`),
        ))(pipe(
          getState('eventLog')(s),
          (l) => RA.makeBy(
            logPageCount,
            (i) => () => pipe(
              RA.get(l.compressedBlocks, i),
              O.map(log.decompressBlock),
              O.getOrElse(() => l.lastBlock),
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
                    whiteSpace: 'break-spaces',
                    padding: '0 2px',
                  },
                }, text(`[${x.level}] ${x.text}`)),
              ])),
            ),
          ),
        ))(getState('logTab')(s)),
      ]),
    ]),
  ],
);
