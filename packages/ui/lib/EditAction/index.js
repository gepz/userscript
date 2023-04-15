import AppPropertyKeys from "../AppPropertyKeys";
import AppPropertyValues from "../AppPropertyValues";
import ComputedProperties from "../ComputedProperties";
import InputUpdater from "../InputUpdater";
import StateDispatchable from "../StateDispatchable";
import EditSetter from "../setter/EditSetter";
export const make = (updateInput) => (key, setter) => (c) => ({
    oninput: updateInput(key)(setter(true))(c),
    onchange: updateInput(key)(setter(false))(c),
});
//# sourceMappingURL=index.js.map