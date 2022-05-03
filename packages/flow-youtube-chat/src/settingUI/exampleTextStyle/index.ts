import {
  StyleProp,
} from 'hyperapp';

import SettingState from '@/SettingState';
import textShadow from '@/textShadow';

export default (s: SettingState): StyleProp => ({
  fontFamily: s.font,
  fontWeight: s.fontWeight.toString(),
  textShadow: textShadow(s.shadowColor)(s.shadowFontWeight),
});
