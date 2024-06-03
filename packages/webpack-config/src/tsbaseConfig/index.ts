import path from 'path';
import {
  Configuration,
} from 'webpack';
import baseConfig from '../baseConfig';
import tsLoaderConfig from '../tsLoaderConfig';
import {
  merge,
} from 'webpack-merge';

export default (rootDir: string): Configuration => merge(
  baseConfig(rootDir),
  tsLoaderConfig('tsconfig.build.json'),
  {
    resolve: {
      extensions: ['.tsx', '.ts'],
    },
    entry: path.join(rootDir, './src/index.ts'),
  },
);
