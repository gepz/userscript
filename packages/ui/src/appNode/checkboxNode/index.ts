import {
  VNode,
} from 'hyperapp';
import {
  ConditionalKeys,
} from 'type-fest';

import BoolUpdater from '@/BoolUpdater';
import AppTextGetter from '@/appNode/AppTextGetter';
import {
  checkboxRow,
} from '@/node';

export default <
  State,
  Props,
  AppCommander,
  Key extends ConditionalKeys<Props, boolean>,
>(
  getText: AppTextGetter<Key, State>,
  getState: <K extends ConditionalKeys<Props, boolean>>(
    k: K
  ) => (s: State) => boolean,
  updateBool: BoolUpdater<State, Props, AppCommander>,
) => (
  label: Key,
) => (
  c: AppCommander,
) => (
  s: State,
): VNode<State> => checkboxRow(
  getText(label)(s),
  getState(label)(s),
  updateBool(label)(c),
);
