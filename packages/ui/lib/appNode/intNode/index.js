"use strict";
// import {
//   VNode,
// } from 'hyperapp';
// import AppPropertyKeys from '@/AppPropertyKeys';
// import ComputedProperties from '@/ComputedProperties';
// import EditAction from '@/EditAction';
// import Editable from '@/Editable';
// import TextGetter from '@/TextGetter';
// import errorText from '@/errorText';
// import rangeRow from '@/node/rangeRow';
// import settingRow from '@/node/settingRow';
// import setEditInt from '@/setter/setEditInt';
// import TextKey from '@/TextKey';
// export default <State, C extends ComputedProperties<State>>(
//   label: TextKey
//   & AppPropertyKeys<State, C, Editable<number>>,
//   min: number,
//   max: number,
//   step: number,
// ) => <AppCommander>(
//   c: AppCommander,
// ) => (
//   s: State,
// ): VNode<State> => settingRow(
//   getText(label)(s),
//   errorText(getText('inputNonNumberic')(s))(s[label]),
//   [
//     rangeRow(
//       min,
//       max,
//       step,
//       editAction(label, setEditInt)(c),
//     )(getState(label)(s)),
//   ],
// );
//# sourceMappingURL=index.js.map