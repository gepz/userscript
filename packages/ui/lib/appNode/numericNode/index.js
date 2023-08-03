import errorText from '../../errorText';
import rangeRow from '../../node/rangeRow';
import settingRow from '../../node/settingRow';
export default (setter) => (editAction, getText, getState) => (label, min, max, step) => (c) => (s) => settingRow(getText(label)(s), errorText(getText('inputNonNumberic')(s))(getState(label)(s)), [
    rangeRow({
        min,
        max,
        step,
    }, 
    // eslint-disable-next-line @typescript-eslint/consistent-type-assertions
    editAction(label, setter)(c))(getState(label)(s)),
]);
//# sourceMappingURL=index.js.map