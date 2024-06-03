import path from 'path';
import baseConfig from '../baseConfig';
import tsLoaderConfig from '../tsLoaderConfig';
import { merge, } from 'webpack-merge';
export default (rootDir) => merge(baseConfig(rootDir), tsLoaderConfig('tsconfig.build.json'), {
    resolve: {
        extensions: ['.tsx', '.ts'],
    },
    entry: path.join(rootDir, './src/index.ts'),
});
//# sourceMappingURL=index.js.map