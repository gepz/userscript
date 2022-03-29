import path from 'path';
import {
  Configuration,
} from 'webpack';


export default (library: string): Configuration => ({
  output: {
    library,
    libraryTarget: 'umd',
  },
  devtool: 'source-map',
});
