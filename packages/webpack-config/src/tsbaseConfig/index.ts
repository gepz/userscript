import path from 'path';
import {
  Configuration,
} from 'webpack';
import baseConfig from '../baseConfig';
import tsLoaderConfig from '../tsLoaderConfig';
import {
  merge,
} from 'webpack-merge';

export default (rootDir: string, mapping: boolean = false): Configuration => merge(
  baseConfig(rootDir),
  tsLoaderConfig('tsconfig.build.json', mapping),
  {
    resolve: {
      extensions: ['.tsx', '.ts'],
    },
    entry: path.join(rootDir, './src/index.ts'),
  },
);
