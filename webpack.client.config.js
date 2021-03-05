const path = require('path')
const MiniCssExtractPlugin = require('mini-css-extract-plugin')
const { WebpackManifestPlugin } = require('webpack-manifest-plugin')
const CopyWebpackPlugin = require('copy-webpack-plugin')

module.exports = (env, argv) => {
    const isProduction = argv.mode === 'production'
    return {
        mode: isProduction ? 'production' : 'development',
        entry: {
            app: "./client/app.tsx",
            site: "./client/site.sass"
        },
        output: {
            filename: isProduction ? '[name].[contenthash].js' : '[name].development.js',
            path: path.resolve(__dirname, 'client/dist/assets'),
            // https://github.com/shellscape/webpack-manifest-plugin/issues/229
            publicPath: ""
        },
        resolve: {
            extensions: ['.tsx', '.ts', '.js']
        },
        plugins: [
            new MiniCssExtractPlugin({
                filename: isProduction ? '[name].[contenthash].css' : '[name].development.css',
            }),
            new WebpackManifestPlugin(),
            new CopyWebpackPlugin({
                patterns: [
                    { from: 'public', to: '../' },
                ],
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
                                configFile: "client/tsconfig.json",
                                transpileOnly: true
                            }
                        },
                        { loader: "ifdef-loader", options: { CLIENT: true, SERVER: false } }
                    ],
                    // TODO use webpack 5 resolve.restrictions for server when it's available
                    exclude: /server|node_modules/,
                },
                {
                    test: /\.css$/,
                    use: [MiniCssExtractPlugin.loader, 'css-loader']
                },
                {
                    test: /\.sass$/,
                    use: [MiniCssExtractPlugin.loader, 'css-loader', 'sass-loader']
                },
                {
                    test: /\.(jpe?g|gif|png|eot|woff|ttf|svg|woff2|mp3)$/,
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
        devServer: {
            port: 1234,
            contentBase: path.resolve(__dirname, 'public'),
            publicPath: '/assets/'
        },
        devtool: "source-map"
    }
}