const path = require('path');

module.exports = (env, argv) => {
    const isProduction = argv.mode === 'production'

    return {
        target: "webworker",
        mode: isProduction ? 'production' : 'development',
        devtool: 'cheap-module-source-map',
        entry: {
            worker: "./server/worker.tsx"
        },
        output: {
            filename: '[name].js',
            path: path.resolve(__dirname, isProduction ? 'server/dist' : 'server/devdist')
        },
        module: {
            rules: [
                {
                    test: /\.tsx?$/,
                    use: 'ts-loader',
                    exclude: /node_modules/,
                },
                {
                    test: /\.(jpe?g|gif|png|eot|woff|ttf|svg|woff2)$/,
                    loader: 'url-loader?limit=10000'
                }
            ],
        },
        resolve: {
            extensions: ['.tsx', '.ts', '.js'],
        }
    }
}