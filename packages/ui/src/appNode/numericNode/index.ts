import {
  VNode,
} from 'hyperapp';

import EditAction from '@/EditAction';
import Editable from '@/Editable';
import ExactTypeKey from '@/ExactTypeKey';
import AppTextGetter from '@/appNode/AppTextGetter';
import errorText from '@/errorText';
import rangeRow from '@/node/rangeRow';
import settingRow from '@/node/settingRow';
import EditSetter from '@/setter/EditSetter';

export default (
  setter: EditSetter<Editable<number>>,
) => <
  State,
  Props,
  AppCommander,
  Key extends ExactTypeKey<Props, Editable<number>>,
>(
  editAction: EditAction<State, Props, AppCommander>,
  getText: AppTextGetter<Key, State>,
  getState: <K extends ExactTypeKey<Props, Editable<number>>>(
    k: K
  ) => (s: State) => Editable<number>,
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
      // eslint-disable-next-line @typescript-eslint/consistent-type-assertions
      editAction(label, setter as EditSetter<Props[Key]>)(c),
    )(getState(label)(s)),
  ],
);

