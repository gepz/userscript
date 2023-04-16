import textColorNode from '@userscript/ui/appNode/textColorNode';
import {
  setEditColor,
} from '@userscript/ui/setter';

import getText from '@/getText';
import editAction from '@/settingUI/editAction';
import getExampleTextStyle from '@/settingUI/getExampleTextStyle';
import getState from '@/settingUI/getState';

export default textColorNode(
  editAction,
  getText,
  getState,
  getExampleTextStyle,
)(setEditColor);
