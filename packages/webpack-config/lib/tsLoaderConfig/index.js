export default (configFile) => ({
    module: {
        rules: [
            {
                test: /\.tsx?$/,
                use: {
                    loader: 'ts-loader',
                    options: {
                        configFile,
                        // Type checking is done by fork-ts-checker in tsbaseConfig.
                        transpileOnly: true,
                    },
                },
                exclude: /node_modules/,
            },
        ],
    },
});
//# sourceMappingURL=index.js.map