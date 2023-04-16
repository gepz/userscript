import errorText from "../../errorText";
import rangeRow from "../../node/rangeRow";
import settingRow from "../../node/settingRow";
export default (editAction, getText, getState) => (setter) => (label, min, max, step) => (c) => (s) => settingRow(getText(label)(s), errorText(getText('inputNonNumberic')(s))(getState(label)(s)), [
    rangeRow({
        min,
        max,
        step,
    }, editAction(label, setter)(c))(getState(label)(s)),
]);
//# sourceMappingURL=index.js.map