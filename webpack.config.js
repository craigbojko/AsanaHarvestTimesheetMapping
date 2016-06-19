var CopyWebpackPlugin = require('copy-webpack-plugin')

module.exports = {
  entry: './app.js',
  output: {
    path: __dirname + '/build',
    filename: '/src/ui/app/'
  },
  module: {
    loaders: [
      { test: /\.less$/, loader: 'style!css!less' },
      { test: /\.html$/, loader: 'html' }
    ]
  },
  plugins: [
    new CopyWebpackPlugin([
        { from: 'src/manifest.json', to: 'manifest.json' },
        { from: 'src/popup/views/index.html', to: 'pages/index.html' }
    ], {
      ignore: [
        { glob: '**/*.psd', dot: true }
      ]
    })
  ]
}
