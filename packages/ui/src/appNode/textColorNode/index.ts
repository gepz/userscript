import {
  pipe,
} from '@effect/data/Function';
import {
  StyleProp,
  VNode,
} from 'hyperapp';

import AppPropertyKeys from '@/AppPropertyKeys';
import AppPropertyValues from '@/AppPropertyValues';
import ComputedProperties from '@/ComputedProperties';
import EditAction from '@/EditAction';
import Editable, * as Ed from '@/Editable';
import AppTextGetter from '@/appNode/AppTextGetter';
import errorText from '@/errorText';
import {
  colorPicker,
  colorTextOutput,
  textInput,
} from '@/node';
import settingRow from '@/node/settingRow';
import EditSetter from '@/setter/EditSetter';

export default <
  State,
  C extends ComputedProperties<State>,
  AppCommander,
  Key extends AppPropertyKeys<State, C, Editable<string>>,
>(
  editAction: EditAction<State, C, AppCommander>,
  getText: AppTextGetter<Key, State>,
  getState: <K extends AppPropertyKeys<State, C, Editable<string>>>(
    k: K
  ) => (s: State) => Editable<string>,
  getExampleTextStyle: (s: State) => StyleProp,
) => (
  setter: EditSetter<Editable<string> & AppPropertyValues<State, C, Key>>,
) => (
  label: Key,
) => (
  c: AppCommander,
) => (
  s: State,
): VNode<State> => settingRow(
  getText(label)(s),
  errorText(getText('invalidColor')(s))(getState(label)(s)),
  pipe(
    {
      a: editAction(label, setter)(c),
      v: Ed.value(getState(label)(s)),
    },
    ({
      a,
      v,
    }) => [
      colorPicker(a)(v),
      textInput(a)(getState(label)(s)),
      colorTextOutput<State>(getExampleTextStyle(s))(v),
    ],
  ),
);
