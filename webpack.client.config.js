const path = require('path')
const MiniCssExtractPlugin = require('mini-css-extract-plugin')
const ManifestPlugin = require('webpack-manifest-plugin')
const CopyWebpackPlugin = require('copy-webpack-plugin')

module.exports = (env, argv) => {
    const isProduction = argv.mode === 'production'
    return {
        entry: {
            app: "./client/app.tsx",
            site: "./client/site.sass"
        },
        output: {
            filename: isProduction ? '[name].[contenthash].js' : '[name].development.js',
            path: path.resolve(__dirname, 'client/dist/assets'),
        },
        resolve: {
            extensions: ['.tsx', '.ts', '.js'],
        },
        plugins: [
            new MiniCssExtractPlugin({
                filename: isProduction ? '[name].[contenthash].css' : '[name].development.css',
            }),
            new ManifestPlugin(),
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
                                transpileOnly: true
                            }
                        }
                    ],
                    exclude: /node_modules/,
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
                    test: /\.(jpe?g|gif|png|eot|woff|ttf|svg|woff2)$/,
                    use: 'url-loader?limit=10000'
                }
            ],
        },
        devServer: {
            port: 1234,
            contentBase: path.resolve(__dirname, 'public'),
            publicPath: '/assets/'
        }
    }
}