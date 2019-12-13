const path = require('path');

module.exports = {
  target: "webworker",
  entry: {
    'index': './index.ts',
  },
  /*devtool: 'inline-source-map',*/
  module: {
    rules: [{
      test: /\.tsx?$/,
      use: 'ts-loader',
      exclude: /node_modules/
    }]
  },
  node: {
    fs: 'empty'
  },
  resolve: {
    extensions: ['.ts', '.js']
  },
  output: {
    filename: '[name].js',
    path: path.resolve(__dirname, 'dist')
  }
};