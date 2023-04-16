import {
  VNode,
} from 'hyperapp';

import AppPropertyKeys from '@/AppPropertyKeys';
import AppPropertyValues from '@/AppPropertyValues';
import ComputedProperties from '@/ComputedProperties';
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
  C extends ComputedProperties<State>,
  AppCommander,
  Key extends AppPropertyKeys<State, C, Editable<readonly string[]>>,
>(
  editAction: EditAction<State, C, AppCommander>,
  getText: AppTextGetter<Key, State>,
  getState: <K extends AppPropertyKeys<State, C, Editable<readonly string[]>>>(
    k: K
  ) => (s: State) => Editable<readonly string[]>,
) => (
  setter: EditSetter<
  Editable<readonly string[]>
  & AppPropertyValues<State, C, Key>
  >,
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
