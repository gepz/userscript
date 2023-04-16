import textAreaNode from '@userscript/ui/appNode/textAreaNode';

import getText from '@/getText';
import editAction from '@/settingUI/editAction';
import getState from '@/settingUI/getState';

export default textAreaNode(editAction, getText, getState);
