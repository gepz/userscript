import {
  Configuration,
} from 'webpack';


export default (libraryName: string): Configuration => ({
  output: {
    library: {
      name: libraryName,
      type: 'umd',
      export:  'default',
    },
  },
  devtool: 'source-map',
});
