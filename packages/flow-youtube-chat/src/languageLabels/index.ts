import languages from '@/languages';

export default [
  'English',
  '日本語',
] as const satisfies {
  // eslint-disable-next-line no-restricted-globals
  length: (typeof languages)['length']
};
