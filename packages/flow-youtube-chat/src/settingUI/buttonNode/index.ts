import * as Z from '@effect/io/Effect';
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
  (c: AppCommander) => (s: SettingState) => Z.Effect<never, never, void>
  >,
): (c: AppCommander) => (s: SettingState) => VNode<SettingState> => (
  c,
) => (state) => h('button', {
  type: 'button',
  onclick: (s) => [
    s,
    () => Z.runPromise(action[label](c)(s)),
  ],
}, text(getText(label)(state.lang)));
