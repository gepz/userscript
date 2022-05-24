import ConfigState from '@/ConfigState';
import UserConfig from '@/UserConfig';
import Expression from '@/settingUI/EditableExpression/Expression';
import * as Ed from '@/ui/Editable';

type MappedConfigState = {
  [P in keyof ConfigState]: ConfigState[P] extends number
  | string
  | readonly string[]
    ? P extends Exclude<keyof ConfigState, 'timingFunction' | 'lang'>
      ? Ed.Editable<UserConfig[P]['val']>
      : UserConfig[P]['val']
    : P extends 'filterExp'
      ? Expression
      : UserConfig[P]['val'];
};

export default MappedConfigState;
