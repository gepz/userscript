import {
  pipe,
} from 'effect/Function';
import {
  StyleProp,
  VNode,
} from 'hyperapp';

import EditAction from '@/EditAction';
import Editable, * as Ed from '@/Editable';
import ExactTypeKey from '@/ExactTypeKey';
import AppTextGetter from '@/appNode/AppTextGetter';
import errorText from '@/errorText';
import {
  colorPicker,
  colorTextOutput,
  textInput,
} from '@/node';
import settingRow from '@/node/settingRow';
import {
  setEditColor,
} from '@/setter';
import EditSetter from '@/setter/EditSetter';

export default <
  State,
  Props,
  AppCommander,
  Key extends ExactTypeKey<Props, Editable<string>>,
>(
  editAction: EditAction<State, Props, AppCommander>,
  getText: AppTextGetter<Key, State>,
  getState: <K extends ExactTypeKey<Props, Editable<string>>>(
    k: K
  ) => (s: State) => Editable<string>,
  getExampleTextStyle: (s: State) => StyleProp,
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
      // eslint-disable-next-line @typescript-eslint/consistent-type-assertions
      a: editAction(label, setEditColor as EditSetter<Props[Key]>)(c),
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

