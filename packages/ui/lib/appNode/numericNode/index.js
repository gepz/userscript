import AppPropertyKeys from "../../AppPropertyKeys";
import AppPropertyValues from "../../AppPropertyValues";
import ComputedProperties from "../../ComputedProperties";
import EditAction from "../../EditAction";
import Editable from "../../Editable";
import TextGetter from "../../TextGetter";
import AppNodeTextKey from "../AppNodeTextKey";
import errorText from "../../errorText";
import rangeRow from "../../node/rangeRow";
import settingRow from "../../node/settingRow";
import EditSetter from "../../setter/EditSetter";
export default (editAction, getText, getState) => (setter) => (label, min, max, step) => (c) => (s) => settingRow(getText(label)(s), errorText(getText('inputNonNumberic')(s))(getState(label)(s)), [
    rangeRow({
        min,
        max,
        step,
    }, editAction(label, setter)(c))(getState(label)(s)),
]);
//# sourceMappingURL=index.js.map