import plainTextAreaNode from '@userscript/ui/appNode/plainTextAreaNode';

import getText from '@/getText';
import editAction from '@/settingUI/editAction';
import getState from '@/settingUI/getState';

export default plainTextAreaNode(editAction, getText, getState);

