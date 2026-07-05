import colorNode from '@userscript/ui/appNode/colorNode';

import getText from '@/getText';
import editAction from '@/settingUI/editAction';
import getState from '@/settingUI/getState';

export default colorNode(editAction, getText, getState);
