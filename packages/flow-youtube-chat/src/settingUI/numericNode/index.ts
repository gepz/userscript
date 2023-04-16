import numericNode from '@userscript/ui/appNode/numericNode';

import getText from '@/getText';
import editAction from '@/settingUI/editAction';
import getState from '@/settingUI/getState';

export default numericNode(editAction, getText, getState);
