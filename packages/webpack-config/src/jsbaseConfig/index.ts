import {
  Configuration,
} from 'webpack';
import baseConfig from '../baseConfig';
import {
  merge,
} from 'webpack-merge';

export default (rootDir: string = process.cwd()): Configuration => merge(
  baseConfig(rootDir),
);
