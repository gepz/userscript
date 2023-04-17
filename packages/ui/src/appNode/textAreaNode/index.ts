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
import {
  textAreaRow,
} from '@/node';
import settingRow from '@/node/settingRow';
import EditSetter from '@/setter/EditSetter';

export default <
  State,
  Props,
  AppCommander,
  Key extends ConditionalKeys<Props, Editable<readonly string[]>>,
>(
  editAction: EditAction<State, Props, AppCommander>,
  getText: AppTextGetter<Key, State>,
  getState: <K extends ConditionalKeys<Props, Editable<readonly string[]>>>(
    k: K
  ) => (s: State) => Editable<readonly string[]>,
) => (
  setter: EditSetter<Editable<readonly string[]> & Props[Key]>,
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
      editAction(label, setter)(c),
    )(getState(label)(s)),
  ],
);
