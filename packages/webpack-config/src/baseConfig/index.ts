import path from 'path';
import {
  Configuration,
} from 'webpack';

// A process.cwd() default for rootDir would silently mis-point the @
// alias whenever a config is loaded by a process not started in the
// package directory, as editor tooling does (docs/decisions.md).
export default (rootDir: string): Configuration => ({
  mode: 'production',
  resolve: {
    extensions: ['.jsx', '.js'],
    alias: {
      '@': path.resolve(rootDir, 'src/'),
    },
  },
  output: {
    filename: '[name]/index.js',
    publicPath: '',
  },
});
