import option from '@userscript/ui/node/option';
import tabContainer from '@userscript/ui/node/tabContainer';
import setFilteredString from '@userscript/ui/setter/setFilteredString';
import {
  Array as A,
} from 'effect';
import {
  pipe,
  apply,
  constant,
  flip,
} from 'effect/Function';
import {
  h,
  text,
  VNode,
} from 'hyperapp';

import AppCommander from '@/AppCommander';
import SettingState from '@/SettingState';
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
import updateAt from '@/settingUI/updateAt';
import updateInput from '@/settingUI/updateInput';

export default (
  c: AppCommander,
) => (
  state: SettingState,
): VNode<SettingState> => (state.showPanel ? h('div', {
  class: 'fyc_panel',
  style: {
    backgroundColor: 'rgba(30,30,30,0.9)',
    position: 'absolute',
    zIndex: '66666',
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
      onchange: updateInput('lang')(
        setFilteredString(languages),
      )(c),
    }, pipe(
      languages,
      A.zip(languageLabels),
      A.map(([lang, label]) => option(
        lang,
        label,
        lang === state.lang,
      )),
    )),
  ]),
  tabContainer<SettingState>({
    container: {},
    label: {
      padding: '6px',
    },
    labelFocus: {
      background: '#666',
    },
    tab: {
      height: '364px',
      display: 'flex',
      padding: '6px',
    },
  })((s, n) => updateAt('mainTab')(n)(c)(s))(pipe(
    [
      'flowChat',
      'chatFilter',
      'chatField',
      'feedback',
    ] as const,
    A.map(getText),
    A.map(apply(state)),
  ))(pipe(
    [
      flowChatPanel,
      filterPanel,
      chatFieldPanel,
      feedbackPanel,
    ] as const,
    A.map(apply(c)),
    A.map(constant),
    A.map(flip),
    A.map(apply(state)),
  ))(getState('mainTab')(state)),
]) : h('div', {}));
