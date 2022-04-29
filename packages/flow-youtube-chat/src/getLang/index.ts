import SettingTextByLang from '@/SettingTextByLang';
import defaultSettingText from '@/defaultSettingText';

export default (language: string) => (
  key: keyof SettingTextByLang,
): string => defaultSettingText[key][
  language === 'FYC_EN' ? 0
  : 1
];
