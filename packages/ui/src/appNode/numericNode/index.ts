import {
  VNode,
} from 'hyperapp';
import {
  ConditionalKeys,
} from 'type-fest';

import EditAction from '@/EditAction';
import Editable from '@/Editable';
import AppTextGetter from '@/appNode/AppTextGetter';
import errorText from '@/errorText';
import rangeRow from '@/node/rangeRow';
import settingRow from '@/node/settingRow';
import EditSetter from '@/setter/EditSetter';

export default <
  State,
  Props,
  AppCommander,
  Key extends ConditionalKeys<Props, Editable<number>>,
>(
  editAction: EditAction<State, Props, AppCommander>,
  getText: AppTextGetter<Key, State>,
  getState: <K extends ConditionalKeys<Props, Editable<number>>>(
    k: K
  ) => (s: State) => Editable<number>,
) => (
  setter: EditSetter<Editable<number> & Props[Key]>,
) => (
  label: Key,
  min: number,
  max: number,
  step: number,
) => (
  c: AppCommander,
) => (
  s: State,
): VNode<State> => settingRow(
  getText(label)(s),
  errorText(getText('inputNonNumberic')(s))(getState(label)(s)),
  [
    rangeRow(
      {
        min,
        max,
        step,
      },
      editAction(label, setter)(c),
    )(getState(label)(s)),
  ],
);
