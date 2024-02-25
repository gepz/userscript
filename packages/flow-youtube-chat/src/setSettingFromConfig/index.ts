// import {
//   pipe,
// } from 'effect/Function';
// import * as O from 'effect/Option';
// import * as expEval from 'expression-eval';

import Editable, * as Ed from '@userscript/ui/Editable';

import SettingState from '@/SettingState';
import UserConfig from '@/UserConfig';
import isEditable from '@/isEditable';
// import Compound from '@/settingUI/editableExpression/Compound';

// import fromJsepExp from '@/settingUI/editableExpression/fromJsepExp';

export default <T extends keyof UserConfig & keyof SettingState>(
  key: T,
) => (
  value: UserConfig[T],
) => (
  state: SettingState,
): SettingState => ({
  ...state,
  [key]: isEditable(key)(value) ? Ed.setValue(value)(
    // eslint-disable-next-line @typescript-eslint/consistent-type-assertions
    state[key] as Editable<UserConfig[T]>,
  // eslint-disable-next-line @typescript-eslint/consistent-type-assertions
  ) : key === 'filterExp' ? undefined
  // ) : key === 'filterExp' ? pipe(
  //   // eslint-disable-next-line max-len
  //   // eslint-disable-next-line @typescript-eslint/consistent-type-assertions
  //   fromJsepExp(value as expEval.parse.Expression),
  //   O.getOrElse((): Compound => ({
  //     type: 'Compound',
  //     body: [],
  //   })),
  // )
  : value,
});

