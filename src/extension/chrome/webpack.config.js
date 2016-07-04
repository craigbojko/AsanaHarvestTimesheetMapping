/**
* @Author: craigbojko
* @Date:   2016-03-14T16:27:28+00:00
* @Last modified by:   craigbojko
* @Last modified time: 2016-07-04T15:38:38+01:00
*/

var CopyWebpackPlugin = require('copy-webpack-plugin')

module.exports = {
  entry: './app.js',
  output: {
    path: '../../../build/extensions/chrome/',
    filename: '/js/content/qubitATQ.js'
  },
  module: {
    noParse: /node_modules\/json-schema\/lib\/validate\.js/,
    loaders: [
      { test: /\.less$/, loader: 'style!css!less' },
      { test: /\.json$/, loader: 'json-loader' },
      { test: /\.html$/, loader: 'html' }
    ]
  },
  plugins: [
    new CopyWebpackPlugin([
      { from: 'src/manifest.json', to: 'manifest.json' },
      { from: 'src/content/views/index.html', to: 'pages/index.html' }
    ], {
      ignore: [
        { glob: '**/*.psd', dot: true }
      ]
    })
  ],
  node: {
    console: true,
    fs: 'empty',
    net: 'empty',
    tls: 'empty',
    require: 'empty'
  }
}
