import TextKey from '@/TextKey';
import defaultText from '@/defaultText';
import languages from '@/languages';

export default (key: TextKey) => (
  language: typeof languages[number][0],
): string => defaultText[key][
  language === 'FYC_EN' ? 0
  : 1
];
