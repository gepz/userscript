import TextByLang from '@/TextByLang';
import defaultText from '@/defaultText';
import languages from '@/languages';

export default (key: keyof TextByLang) => (
  language: typeof languages[number][0],
): string => defaultText[key][
  language === 'FYC_EN' ? 0
  : 1
];
