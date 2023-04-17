import {
  pipe,
} from '@effect/data/Function';
import {
  VNode,
} from 'hyperapp';

import EditAction from '@/EditAction';
import Editable, * as Ed from '@/Editable';
import ExactTypeKey from '@/ExactTypeKey';
import AppTextGetter from '@/appNode/AppTextGetter';
import errorText from '@/errorText';
import {
  colorPicker,
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
    // eslint-disable-next-line @typescript-eslint/consistent-type-assertions
    editAction(label, setEditColor as EditSetter<Props[Key]>)(c),
    (x) => [
      colorPicker(x)(Ed.value(getState(label)(s))),
      textInput(x)(getState(label)(s)),
    ],
  ),
);
