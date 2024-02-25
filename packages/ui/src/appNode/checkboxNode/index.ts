import {
  VNode,
} from 'hyperapp';

import BoolUpdater from '@/BoolUpdater';
import ExactTypeKey from '@/ExactTypeKey';
import AppTextGetter from '@/appNode/AppTextGetter';
import {
  checkboxRow,
} from '@/node';

export default <
  State,
  Props,
  AppCommander,
  Key extends ExactTypeKey<Props, boolean>,
>(
  getText: AppTextGetter<Key, State>,
  getState: <K extends ExactTypeKey<Props, boolean>>(
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

