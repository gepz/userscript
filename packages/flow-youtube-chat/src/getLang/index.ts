import SettingTextByLang from '@/SettingTextByLang';
import defaultSettingText from '@/defaultSettingText';

export default (lang: string) => (
  key: keyof SettingTextByLang,
): string => defaultSettingText[key][
  lang === 'FYC_EN' ? 0
  : 1
];
