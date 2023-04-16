import { pipe, } from '@effect/data/Function';
import * as Ed from "../../Editable";
import errorText from "../../errorText";
import { colorPicker, colorTextOutput, textInput, } from "../../node";
import settingRow from "../../node/settingRow";
export default (editAction, getText, getState, getExampleTextStyle) => (setter) => (label) => (c) => (s) => settingRow(getText(label)(s), errorText(getText('invalidColor')(s))(getState(label)(s)), pipe({
    a: editAction(label, setter)(c),
    v: Ed.value(getState(label)(s)),
}, ({ a, v, }) => [
    colorPicker(a)(v),
    textInput(a)(getState(label)(s)),
    colorTextOutput(getExampleTextStyle(s))(v),
]));
//# sourceMappingURL=index.js.map