import path from 'path';
// A process.cwd() default for rootDir would silently mis-point the @
// alias whenever a config is loaded by a process not started in the
// package directory, as editor tooling does (docs/decisions.md).
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