import path from 'path';
import {
  Configuration,
} from 'webpack';

// rootDir is the package directory, which pnpm makes the cwd of every script it
// runs. Defaulting it keeps the calling config free of __dirname: that would
// make the config CommonJS, and Node's type stripping can only load these
// configs -- and so spare us ts-node -- while they are plain ESM.
export default (rootDir: string = process.cwd()): Configuration => ({
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
