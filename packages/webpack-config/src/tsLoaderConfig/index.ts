import {
  Configuration,
} from 'webpack';

export default (configFile: string, sourceMap: boolean = false): Configuration => ({
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        use: {
          loader: 'ts-loader',
          options: { 
            configFile,
            compilerOptions: {
              sourceMap,
            },
          },
        },
        exclude: /node_modules/,
      },
    ],
  },
});
