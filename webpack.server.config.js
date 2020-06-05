const path = require('path');

module.exports = {
    target: "webworker",
    entry: "./server/worker.tsx",
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
    },
    output: {
        filename: 'bundle.js',
        path: path.resolve(__dirname, 'dist'),
    }
};