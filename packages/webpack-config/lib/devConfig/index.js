import path from 'path';
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