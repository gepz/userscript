import errorText from "../../errorText";
import { textAreaRow, } from "../../node";
import settingRow from "../../node/settingRow";
export default (editAction, getText, getState) => (setter) => (label, rows) => (c) => (s) => settingRow(getText(label)(s), errorText(getText('invalidSetting')(s))(getState(label)(s)), [
    textAreaRow(rows, editAction(label, setter)(c))(getState(label)(s)),
]);
//# sourceMappingURL=index.js.map