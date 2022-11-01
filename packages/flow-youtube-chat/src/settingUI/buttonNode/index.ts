import * as R from 'fp-ts/Reader';
import * as T from 'fp-ts/Task';
import {
  h,
  text,
  VNode,
} from 'hyperapp';

import AppCommander from '@/AppCommander';
import SettingState from '@/SettingState';
import TextKey from '@/TextKey';
import {
  TypeKey,
} from '@/TypeKey';
import getText from '@/getText';
import action from '@/settingUI/action';

export default (
  label: TextKey
  & TypeKey<
  typeof action,
  R.Reader<AppCommander, R.Reader<SettingState, T.Task<void>>>
  >,
): R.Reader<AppCommander, R.Reader<SettingState, VNode<SettingState>>> => (
  c,
) => (state) => h('button', {
  type: 'button',
  onclick: (s) => [
    s,
    action[label](c)(s),
  ],
}, text(getText(label)(state.lang)));
