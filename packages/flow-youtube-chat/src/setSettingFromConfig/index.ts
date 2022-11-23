import * as expEval from 'expression-eval';
import * as O from 'fp-ts/Option';
import {
  pipe,
} from 'fp-ts/function';

import SettingState from '@/SettingState';
import UserConfig from '@/UserConfig';
import isEditable from '@/isEditable';
import Compound from '@/settingUI/EditableExpression/Compound';
import fromJsepExp from '@/settingUI/EditableExpression/fromJsepExp';
import Editable, * as Ed from '@/ui/Editable';

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
  ) : key === 'filterExp' ? pipe(
    // eslint-disable-next-line max-len
    // eslint-disable-next-line @typescript-eslint/consistent-type-assertions
    fromJsepExp(value as expEval.parse.Expression),
    O.getOrElseW((): Compound => ({
      type: 'Compound',
      body: [],
    })),
  )
  : value,
});
