/**
 * DEVELOPMENT WEBPACK CONFIGURATION
 */

const path = require('path')
const webpack = require('webpack')
const HtmlWebpackPlugin = require('html-webpack-plugin')

module.exports = require('./webpack.base.babel')({
  mode: 'development',

  entry: [
    'webpack-hot-middleware/client?reload=true',
    path.join(process.cwd(), 'app/iframe/child.js'),
  ],
  output: {
    filename: '[name].js',
    chunkFilename: '[name].chunk.js',
  },

  optimization: {
    minimize: false,
    splitChunks: {
      chunks: 'all',
    },
  },

  devServer: {
    port: 8082,
    host: '0.0.0.0',
  },

  plugins: [
    new webpack.HotModuleReplacementPlugin(), // Tell webpack we want hot reloading
    new HtmlWebpackPlugin({
      inject: true, // Inject all files that are generated by webpack, e.g. bundle.js
      template: 'app/index.html',
    }),
  ],
  devtool: 'eval-source-map',

  performance: {
    hints: false,
  },
})
