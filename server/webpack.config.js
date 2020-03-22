const path = require('path')
const Dotenv = require('dotenv-webpack')

module.exports = {
  target: "webworker",
  entry: {
    'worker': './worker.ts',
  },
  module: {
    rules: [{
      test: /\.tsx?$/,
      use: {
        loader: 'ts-loader',
        options: {
          transpileOnly: true
        }
      },
      exclude: /node_modules/,
    }]
  },
  resolve: {
    extensions: ['.ts', '.js']
  },
  output: {
    filename: '[name].js',
    path: path.resolve(__dirname, 'dist')
  },
  plugins: [
    // This plugin loads settings from .env so we can import them
    new Dotenv()
  ]
}