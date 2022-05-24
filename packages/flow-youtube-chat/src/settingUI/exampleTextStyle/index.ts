import {
  StyleProp,
} from 'hyperapp';

import SettingState from '@/SettingState';
import textShadow from '@/textShadow';
import * as Ed from '@/ui/Editable';

export default (s: SettingState): StyleProp => ({
  fontFamily: Ed.value(s.font),
  fontWeight: Ed.value(s.fontWeight).toString(),
  textShadow: textShadow(Ed.value(s.shadowColor))(
    Ed.value(s.shadowFontWeight),
  ),
});
