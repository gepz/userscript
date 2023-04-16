import { checkboxRow, } from "../../node";
export default (updateBool, getText, getState) => (label) => (c) => (s) => checkboxRow(getText(label)(s), getState(label)(s), updateBool(label)(c));
//# sourceMappingURL=index.js.map