import languages from '@/languages';

export default [
  'English(US)',
  '日本語',
  '简体中文',
] as const satisfies {

  length: (typeof languages)['length']
};
