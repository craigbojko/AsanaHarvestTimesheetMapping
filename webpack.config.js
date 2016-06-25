/**
* @Author: craigbojko
* @Date:   2016-03-20T17:04:11+00:00
* @Last modified by:   craigbojko
* @Last modified time: 2016-06-21T14:25:45+01:00
*/

var CopyWebpackPlugin = require('copy-webpack-plugin')
var webpack = require('webpack')

module.exports = {
  cache: true,
  entry: {
    client: './src/ui/public/client/client.js'
  },
  output: {
    path: './build/client',
    filename: '[name].js'
  },
  watch: true,
  keepalive: true,
  plugins: [
    new webpack.OldWatchingPlugin(),
    new CopyWebpackPlugin([
      { from: 'src/ui/public/client/views', to: 'views' }
    ], {
      ignore: [
        { glob: '**/*.psd', dot: true }
      ]
    })
  ],
  module: {
    loaders: [
      { test: /\.jsx?$/, exclude: /(node_modules|bower_components)/, loader: 'babel' },
      { test: /\.css$/, loader: 'style-loader!css-loader' },
      { test: /\.html$/, loader: 'html' },
      { test: /\.eot(\?v=\d+\.\d+\.\d+)?$/, loader: 'file' },
      { test: /\.(woff|woff2)$/, loader: 'url?prefix=font/&limit=5000' },
      { test: /\.ttf(\?v=\d+\.\d+\.\d+)?$/, loader: 'url?limit=10000&mimetype=application/octet-stream' },
      { test: /\.svg(\?v=\d+\.\d+\.\d+)?$/, loader: 'url?limit=10000&mimetype=image/svg+xml' }
    ]
  }
}
