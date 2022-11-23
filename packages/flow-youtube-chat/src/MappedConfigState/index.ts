import UserConfig from '@/UserConfig';
import Expression from '@/settingUI/EditableExpression/Expression';
import Editable from '@/ui/Editable';

type MappedConfigState = {
  [P in keyof UserConfig]: UserConfig[P] extends number
  | string
  | readonly string[]
    ? P extends Exclude<keyof UserConfig, 'timingFunction' | 'lang'>
      ? Editable<UserConfig[P]>
      : UserConfig[P]
    : P extends 'filterExp'
      ? Expression
      : UserConfig[P];
};

export default MappedConfigState;
