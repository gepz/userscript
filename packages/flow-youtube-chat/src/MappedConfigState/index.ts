import Editable from '@userscript/ui/Editable';

import UserConfig from '@/UserConfig';
// import Expression from '@/settingUI/editableExpression/Expression';

type MappedConfigState = {
  [P in keyof UserConfig]: UserConfig[P] extends number
  | string
  | readonly string[]
    ? P extends Exclude<keyof UserConfig, 'timingFunction' | 'lang'>
      ? Editable<UserConfig[P]>
      : UserConfig[P]
    : P extends 'filterExp'
      ? undefined
      // ? Expression
      : UserConfig[P];
};

export default MappedConfigState;
