
const path = require('path')

const HTMLWebpackPlugin = require('html-webpack-plugin')

module.exports = {
  devtool: 'cheap-module-eval-source-map',

  resolve: {
    extensions: ['.js', '.jsx'],
    modules: [
      path.join(__dirname, 'frontend', 'src'),
      'node_modules'
    ]
  },

  entry: [path.join(__dirname, 'frontend', 'src', 'index.jsx')],

  output: {
    path: path.join(__dirname, 'backend', 'public'),
    filename: 'bundle.js',
    publicPath: '/'
  },

  module: {
    rules: [
      {
        test: /\.jsx?$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader'
        }
      },
      {
        test: /\.eot(\?v=\d+\.\d+\.\d+)?$/,
        use: 'file-loader'
      },
      {
        test: /\.(woff|woff2)$/,
        use: 'url-loader?prefix=font/&limit=5000'
      },
      {
        test: /\.ttf(\?v=\d+\.\d+\.\d+)?$/,
        use: 'url-loader?limit=10000&mimetype=application/octet-stream'
      },
      {
        test: /\.svg(\?v=\d+\.\d+\.\d+)?$/,
        use: 'url-loader?limit=10000&mimetype=image/svg+xml'
      }
    ]
  },

  plugins: [
    new HTMLWebpackPlugin({
      template: path.join(__dirname, 'frontend', 'index.html'),
      filename: 'index.html'
    })
  ]
}
