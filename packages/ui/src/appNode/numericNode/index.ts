import {
  VNode,
} from 'hyperapp';

import AppPropertyKeys from '@/AppPropertyKeys';
import AppPropertyValues from '@/AppPropertyValues';
import ComputedProperties from '@/ComputedProperties';
import EditAction from '@/EditAction';
import Editable from '@/Editable';
import TextGetter from '@/TextGetter';
import AppNodeTextKey from '@/appNode/AppNodeTextKey';
import errorText from '@/errorText';
import rangeRow from '@/node/rangeRow';
import settingRow from '@/node/settingRow';
import EditSetter from '@/setter/EditSetter';

export default <
  State,
  C extends ComputedProperties<State>,
  AppCommander,
  Key extends AppPropertyKeys<State, C, Editable<number>>,
>(
  editAction: EditAction<State, C, AppCommander>,
  getText: TextGetter<
  Key | AppNodeTextKey,
  State
  >,
  getState: <K extends Key>(k: K) => (
    s: State
  ) => Editable<number>,
) => (
  setter: EditSetter<
  Editable<number>
  & AppPropertyValues<State, C, Key>
  >,
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
