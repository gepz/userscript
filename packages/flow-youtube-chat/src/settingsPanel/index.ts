import * as R from 'fp-ts/Reader';
import * as RA from 'fp-ts/ReadonlyArray';
import {
  pipe,
  flow,
  apply,
  constant,
} from 'fp-ts/function';
import {
  h,
  text,
  VNode,
} from 'hyperapp';

import AppCommander from '@/AppCommander';
import SettingState from '@/SettingState';
import flip from '@/flip';
import getText from '@/getText';
import languageLabels from '@/languageLabels';
import languages from '@/languages';
import chatFieldPanel from '@/settingUI/chatFieldPanel';
import feedbackPanel from '@/settingUI/feedbackPanel';
// eslint-disable-next-line max-len
// eslint-disable-next-line consistent-default-export-name/default-import-match-filename
import filterPanel from '@/settingUI/filterPanelOld';
// import filterPanel from '@/settingUI/filterPanel';
import flowChatPanel from '@/settingUI/flowChatPanel';
import getState from '@/settingUI/getState';
import setString from '@/settingUI/setString';
import updateAt from '@/settingUI/updateAt';
import updateInput from '@/settingUI/updateInput';
import option from '@/ui/option';
import tabContainer from '@/ui/tabContainer';

export default (
  c: AppCommander,
): R.Reader<SettingState, VNode<SettingState>> => flow(
  (state) => (state.showPanel ? h('div', {
    class: 'fyc_panel',
    style: {
      backgroundColor: 'rgba(30,30,30,0.9)',
      position: 'absolute',
      zIndex: '10000',
      color: '#fff',
      fontSize: '14px',
      overflow: 'auto',
      left: `${state.panelRect.x}px`,
      top: `${state.panelRect.y}px`,
      width: `${state.panelRect.width}px`,
      height: `${state.panelRect.height}px`,
      border: 'solid 1px #666',
      fontFamily: 'MS PGothic',
      lineHeight: '1.2',
      colorScheme: 'dark',
    },
  }, [
    h('div', {
      style: {
        position: 'absolute',
        inset: '3px 3px auto auto',
      },
    }, [
      text('🌐'),
      h('select', {
        onchange: updateInput(setString)('lang')(c),
      }, pipe(
        languages,
        RA.mapWithIndex((i, lang) => option(
          lang,
          languageLabels[i],
          lang === state.lang,
        )),
      )),
    ]),
    tabContainer<SettingState>({
      container: {
        height: '364px',
      },
      label: {
        padding: '6px',
      },
      labelFocus: {
        background: '#666',
      },
      tab: {
        display: 'flex',
        padding: '6px',
      },
    })((s, n) => updateAt('mainTab', n)(c)(s))(pipe(
      [
        'flowChat',
        'chatFilter',
        'chatField',
        'feedback',
      ],
      RA.map(getText),
      RA.map(apply(state.lang)),
    ))(pipe(
      [
        flowChatPanel,
        filterPanel,
        chatFieldPanel,
        feedbackPanel,
      ] as const,
      RA.map(apply(c)),
      RA.map(constant),
      RA.map(flip),
      RA.map(apply(state)),
    ))(getState<number>('mainTab')(state)),
  ]) : h('div', {})),
);
