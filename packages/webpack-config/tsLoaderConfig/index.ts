import {
  Configuration,
} from 'webpack';

export default (configFile: string): Configuration => ({
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        use: {
          loader: 'ts-loader',
          options: { 
            configFile,
            compilerOptions: {
              declaration: false,
              sourceMap: false,
              declarationMap: false,
            },
          },
        },
        exclude: /node_modules/,
      },
    ],
  },
});
