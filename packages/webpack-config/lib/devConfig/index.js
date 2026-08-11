import path from 'path';
// See baseConfig for why rootDir must be explicit.
export default (rootDir) => ({
    mode: 'development',
    devServer: {
        static: {
            directory: path.join(rootDir, 'dist'),
        },
        compress: false,
    },
});
//# sourceMappingURL=index.js.map