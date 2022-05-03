import * as R from 'fp-ts/Reader';
import {
  h, text, VNode,
} from 'hyperapp';

import SettingConfig from '@/SettingConfig';
import SettingState from '@/SettingState';
import TextByLang from '@/TextByLang';
import {
  TypeKey,
} from '@/TypeKey';
import getText from '@/getText';
import doAct from '@/settingUI/doAct';

export default (
  label: keyof TextByLang
  & TypeKey<typeof doAct, (c: SettingConfig) => Promise<void>>,
): R.Reader<SettingConfig, VNode<SettingState>> => (
  c,
) => h('button', {
  type: 'button',
  onclick: (s) => [
    s,
    [() => doAct[label](c), undefined],
  ],
}, text(getText(label)(c.state.lang)));
