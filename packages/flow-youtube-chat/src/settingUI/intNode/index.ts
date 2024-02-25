import intNode from '@userscript/ui/appNode/intNode';

import getText from '@/getText';
import editAction from '@/settingUI/editAction';
import getState from '@/settingUI/getState';

export default intNode(editAction, getText, getState);

