import {
  Configuration,
} from 'webpack';


export default (libraryName: string): Configuration => ({
  output: {
    library: {
      name: libraryName,
      type: 'umd',
    },
  },
  devtool: 'source-map',
});
