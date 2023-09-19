import path from 'path';
export default (rootDir) => ({
    mode: 'production',
    resolve: {
        extensions: ['.jsx', '.js'],
        alias: {
            '@': path.resolve(rootDir, 'src/'),
        },
    },
    output: {
        filename: '[name]/index.js',
        publicPath: '',
    },
});
//# sourceMappingURL=index.js.map