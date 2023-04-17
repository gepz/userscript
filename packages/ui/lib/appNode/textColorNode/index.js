import { pipe, } from '@effect/data/Function';
import * as Ed from "../../Editable";
import errorText from "../../errorText";
import { colorPicker, colorTextOutput, textInput, } from "../../node";
import settingRow from "../../node/settingRow";
import { setEditColor, } from "../../setter";
export default (editAction, getText, getState, getExampleTextStyle) => (label) => (c) => (s) => settingRow(getText(label)(s), errorText(getText('invalidColor')(s))(getState(label)(s)), pipe({
    // eslint-disable-next-line @typescript-eslint/consistent-type-assertions
    a: editAction(label, setEditColor)(c),
    v: Ed.value(getState(label)(s)),
}, ({ a, v, }) => [
    colorPicker(a)(v),
    textInput(a)(getState(label)(s)),
    colorTextOutput(getExampleTextStyle(s))(v),
]));
//# sourceMappingURL=index.js.map