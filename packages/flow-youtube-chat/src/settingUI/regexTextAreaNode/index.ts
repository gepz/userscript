import regexTextAreaNode from '@userscript/ui/appNode/regexTextAreaNode';

import getText from '@/getText';
import editAction from '@/settingUI/editAction';
import getState from '@/settingUI/getState';

export default regexTextAreaNode(editAction, getText, getState);

