import { pipe, } from 'effect/Function';
import * as Ed from '../../Editable';
import errorText from '../../errorText';
import { colorPicker, textInput, } from '../../node';
import settingRow from '../../node/settingRow';
import { setEditColor, } from '../../setter';
export default (editAction, getText, getState) => (label) => (c) => (s) => settingRow(getText(label)(s), errorText(getText('invalidColor')(s))(getState(label)(s)), pipe(
// eslint-disable-next-line @typescript-eslint/consistent-type-assertions
editAction(label, setEditColor)(c), (x) => [
    colorPicker(x)(Ed.value(getState(label)(s))),
    textInput(x)(getState(label)(s)),
]));
//# sourceMappingURL=index.js.map