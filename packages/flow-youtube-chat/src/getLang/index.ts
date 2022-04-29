import TextByLang from '@/TextByLang';
import defaultText from '@/defaultText';

export default (language: string) => (
  key: keyof TextByLang,
): string => defaultText[key][
  language === 'FYC_EN' ? 0
  : 1
];
