import baseConfig from '../baseConfig/index.js';
import { merge, } from 'webpack-merge';
export default (rootDir = process.cwd()) => merge(baseConfig(rootDir));
//# sourceMappingURL=index.js.map