import errorText from '../../errorText';
import { textAreaRow, } from '../../node';
import settingRow from '../../node/settingRow';
export default (setter) => (editAction, getText, getState) => (label, rows) => (c) => (s) => settingRow(getText(label)(s), errorText(getText('invalidSetting')(s))(getState(label)(s)), [
    textAreaRow(rows, 
    // eslint-disable-next-line @typescript-eslint/consistent-type-assertions
    editAction(label, setter)(c))(getState(label)(s)),
]);
//# sourceMappingURL=index.js.map