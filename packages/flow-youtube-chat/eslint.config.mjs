import packageConfig from '@userscript/eslint-config/packageConfig';
import compat from 'eslint-plugin-compat';

export default packageConfig({
  dirname: import.meta.dirname,
  // The src directories below mirror tsconfig.exclude.json: they are excluded
  // from every TS project, so type-aware linting cannot parse them. Keep the
  // two lists in sync; when a directory rejoins the build, unignore it here.
  ignores: [
    'src/filter/filterContextType/',
    'src/restrictedExpression/',
    'src/settingUI/EditableExpression/',
    'src/settingUI/filter/',
    'src/settingUI/filterPanel/',
    'src/type/',
    'src/typedExpression/',
  ],
  append: [
    {
      ...compat.configs['flat/recommended'],
      files: ['**/*.ts', '**/*.tsx'],
    },
  ],
});
