const path = require('path')
const webpack = require('webpack')
const fs = require('fs')
const uuid = require('uuid').v4

function maybeReadFile(path) {
    try {
        return fs.readFileSync(path, 'utf8')
    } catch (err) {
        return undefined
    }
}

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
                WEBPACK_MANIFEST: maybeReadFile(path.resolve(__dirname, 'client/dist/assets/manifest.json')),
                BUILD_ID: uuid(),
                CFSCRIPT_HASH: null // To be used by once-off scripts identifying themselves
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
                                configFile: "server/tsconfig.json",
                                transpileOnly: true
                            }
                        },
                        { loader: "ifdef-loader", options: { CLIENT: false, SERVER: true } }
                    ],
                    exclude: /client|node_modules/
                },
                {
                    test: /\.(jpe?g|gif|png|eot|woff|ttf|svg|woff2)$/,
                    use: [{
                        loader: 'file-loader',
                        options: {
                            name: 'assets/[name].[contenthash].[ext]',
                            publicPath: '/'
                        },
                    }]
                }
            ],
        },
        resolve: {
            extensions: ['.tsx', '.ts', '.js'],
            fallback: { "crypto": false }
        }
    }
}