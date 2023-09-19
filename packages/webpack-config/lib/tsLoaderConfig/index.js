export default (configFile, sourceMap = false) => ({
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
//# sourceMappingURL=index.js.map