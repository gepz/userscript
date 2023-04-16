import {
  pipe,
} from '@effect/data/Function';
import * as Z from '@effect/io/Effect';
import {
  h,
  text,
  VNode,
} from 'hyperapp';
import {
  ConditionalKeys,
} from 'type-fest';

import AppCommander from '@/AppCommander';
import SettingState from '@/SettingState';
import TextKey from '@/TextKey';
import getText from '@/getText';
import action from '@/settingUI/action';

export default (
  label: TextKey
  & ConditionalKeys<
  typeof action,
  (c: AppCommander) => (s: SettingState) => Z.Effect<never, never, SettingState>
  >,
): (c: AppCommander) => (s: SettingState) => VNode<SettingState> => (
  c,
) => (state) => h('button', {
  type: 'button',
  onclick: (s) => [
    s,
    (d) => Z.runPromise(c.provideLog(pipe(
      action[label](c)(s),
      Z.flatMap((newS) => Z.sync(() => d(newS))),
    ))),
  ],
}, text(getText(label)(state)));
