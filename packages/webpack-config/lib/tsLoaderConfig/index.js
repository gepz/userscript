export default (configFile) => ({
    module: {
        rules: [
            {
                test: /\.tsx?$/,
                use: {
                    loader: 'ts-loader',
                    options: {
                        configFile,
                    },
                },
                exclude: /node_modules/,
            },
        ],
    },
});
//# sourceMappingURL=index.js.map