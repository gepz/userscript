import {
  Configuration,
} from 'webpack';

export default (configFile: string, mapping: boolean = false): Configuration => ({
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        use: {
          loader: 'ts-loader',
          options: { 
            configFile,
            compilerOptions: {
              declaration: mapping,
              sourceMap: mapping,
              declarationMap: mapping,
            },
          },
        },
        exclude: /node_modules/,
      },
    ],
  },
});
