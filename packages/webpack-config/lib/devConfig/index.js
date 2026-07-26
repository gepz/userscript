import path from 'path';
// See baseConfig for why rootDir defaults to the cwd.
export default (rootDir = process.cwd()) => ({
    mode: 'development',
    devServer: {
        static: {
            directory: path.join(rootDir, 'dist'),
        },
        compress: false,
    },
});
//# sourceMappingURL=index.js.map