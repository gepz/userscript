import { Configuration as WebpackConfiguration } from "webpack";
import { Configuration as WebpackDevServerConfiguration } from "webpack-dev-server";
interface Configuration extends WebpackConfiguration {
    devServer?: WebpackDevServerConfiguration;
}
declare const _default: (rootDir: string) => Configuration;
export default _default;
//# sourceMappingURL=index.d.ts.map