import {
  VNode,
} from 'hyperapp';

import EditAction from '@/EditAction';
import Editable from '@/Editable';
import ExactTypeKey from '@/ExactTypeKey';
import AppTextGetter from '@/appNode/AppTextGetter';
import errorText from '@/errorText';
import {
  textAreaRow,
} from '@/node';
import settingRow from '@/node/settingRow';
import EditSetter from '@/setter/EditSetter';

export default (
  setter: EditSetter<Editable<readonly string[]>>,
) => <
  State,
  Props,
  AppCommander,
  Key extends ExactTypeKey<Props, Editable<readonly string[]>>,
>(
  editAction: EditAction<State, Props, AppCommander>,
  getText: AppTextGetter<Key, State>,
  getState: <K extends ExactTypeKey<Props, Editable<readonly string[]>>>(
    k: K
  ) => (s: State) => Editable<readonly string[]>,
) => (
  label: Key,
  rows: number,
) => (
  c: AppCommander,
) => (
  s: State,
): VNode<State> => settingRow(
  getText(label)(s),
  errorText(getText('invalidSetting')(s))(getState(label)(s)),
  [
    textAreaRow(
      rows,
      // eslint-disable-next-line @typescript-eslint/consistent-type-assertions
      editAction(label, setter as EditSetter<Props[Key]>)(c),
    )(getState(label)(s)),
  ],
);

