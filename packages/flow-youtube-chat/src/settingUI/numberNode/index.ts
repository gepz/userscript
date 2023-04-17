import numberNode from '@userscript/ui/appNode/numberNode';

import getText from '@/getText';
import editAction from '@/settingUI/editAction';
import getState from '@/settingUI/getState';

export default numberNode(editAction, getText, getState);
