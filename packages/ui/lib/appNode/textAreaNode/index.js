import AppPropertyKeys from "../../AppPropertyKeys";
import AppPropertyValues from "../../AppPropertyValues";
import ComputedProperties from "../../ComputedProperties";
import EditAction from "../../EditAction";
import Editable from "../../Editable";
import TextGetter from "../../TextGetter";
import AppNodeTextKey from "../AppNodeTextKey";
import errorText from "../../errorText";
import { textAreaRow, } from "../../node";
import settingRow from "../../node/settingRow";
import EditSetter from "../../setter/EditSetter";
export default (editAction, getText, getState) => (setter) => (label, rows) => (c) => (s) => settingRow(getText(label)(s), errorText(getText('invalidSetting')(s))(getState(label)(s)), [
    textAreaRow(rows, editAction(label, setter)(c))(getState(label)(s)),
]);
//# sourceMappingURL=index.js.map