const path = require('path')
const webpack = require('webpack')
const fs = require('fs')
const uuid = require('uuid').v4

module.exports = (env, argv) => {
    const isProduction = argv.mode === 'production'

    const commitHash = require('child_process')
        .execSync('git rev-parse --short HEAD')
        .toString()

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
        plugins: [
            new webpack.EnvironmentPlugin({
                WEBPACK_MANIFEST: fs.readFileSync(path.resolve(__dirname, 'client/dist/assets/manifest.json'), 'utf8'),
                BUILD_ID: uuid()
            })
        ],
        module: {
            rules: [
                {
                    test: /\.tsx?$/,
                    use: [
                        {
                            loader: 'ts-loader',
                            options: {
                                transpileOnly: true
                            }
                        }
                    ],
                    exclude: /node_modules/
                },
                {
                    test: /\.(jpe?g|gif|png|eot|woff|ttf|svg|woff2)$/,
                    use: [{
                        loader: 'file-loader',
                        options: {
                            name: '[name].[contenthash].[ext]',
                            publicPath: '/assets/'
                        },
                    }]
                }
            ],
        },
        resolve: {
            extensions: ['.tsx', '.ts', '.js'],
        }
    }
}