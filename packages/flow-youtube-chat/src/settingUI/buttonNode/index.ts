import * as R from 'fp-ts/Reader';
import {
  h, text, VNode,
} from 'hyperapp';

import AppCommander from '@/AppCommander';
import SettingState from '@/SettingState';
import TextByLang from '@/TextByLang';
import {
  TypeKey,
} from '@/TypeKey';
import getText from '@/getText';
import doAct from '@/settingUI/doAct';

export default (
  label: keyof TextByLang
  & TypeKey<
  typeof doAct,
  R.Reader<AppCommander, R.Reader<SettingState, Promise<void>>>
  >,
): R.Reader<AppCommander, R.Reader<SettingState, VNode<SettingState>>> => (
  c,
) => (state) => h('button', {
  type: 'button',
  onclick: (s) => [
    s,
    [() => doAct[label](c)(s), undefined],
  ],
}, text(getText(label)(state.lang)));
