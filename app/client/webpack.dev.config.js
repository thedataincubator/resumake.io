const { resolve } = require('path')
const webpack = require('webpack')
const HTMLWebpackPlugin = require('html-webpack-plugin')

const config = {
  devtool: 'source-map',

  entry: [
    'babel-polyfill',
    './index.js'
  ],

  output: {
    filename: 'bundle.js',
    path: resolve(__dirname, 'dist'),
    publicPath: '/'
  },

  context: resolve(__dirname, 'src'),

  devServer: {
    port: 3000,
    hot: true,
    publicPath: '/',
    historyApiFallback: {
      disableDotRule: true
    },
    proxy: {
      '/resumake/api/**': {
        // Proxy api requests to the server running on port 3001.
        target: 'http://localhost:3001',
        pathRewrite: {'^/resumake' : ''},
        secure: false
      },
      '/fellows/**': {
        // Proxy main website requests to locally running website GAE app.
        // NOTE: our development setup is _greatly_ simplified by the fact that the cookies are shared
        // across the domain, regardless of port numbers.
        // See: https://stackoverflow.com/a/16328399
        // If that wasn't the case, we would have to add {credentials: 'include'} in our fetch calls when
        // in development environment. Moreover, we would also have to add Flask-Cors to our server, allowing
        // credentialeed requests to localhost:3000 origin.
        target: 'http://localhost:8080',
        secure: false
      }
    }
  },

  module: {
    rules: [
      {
        test: /\.js$/,
        loaders: ['babel-loader'],
        exclude: /node_modules/
      },
      {
        test: /\.(jpg|jpeg|png|gif|ico|svg|pdf|eof)$/,
        use: 'url-loader?limit=15000&name=images/[name].[ext]'
      },
      {
        test: /\.eot(\?v=\d+.\d+.\d+)?$/,
        use: 'file-loader?&name=fonts/[name].[ext]'
      },
      {
        test: /\.woff(2)?(\?v=[0-9]\.[0-9]\.[0-9])?$/,
        use:
          'url-loader?limit=10000&mimetype=application/font-woff&name=fonts/[name].[ext]'
      },
      {
        test: /\.[ot]tf(\?v=\d+.\d+.\d+)?$/,
        use:
          'url-loader?limit=10000&mimetype=application/octet-stream&name=fonts/[name].[ext]'
      },
      {
        test: /\.svg(\?v=\d+\.\d+\.\d+)?$/,
        use:
          'url-loader?limit=10000&mimetype=image/svg+xml&name=images/[name].[ext]'
      }
    ]
  },

  plugins: [
    new HTMLWebpackPlugin({
      template: './index.html',
      favicon: './app/assets/favicon.ico',
      inject: 'body'
    }),
    new webpack.NamedModulesPlugin(),
    new webpack.DefinePlugin({
      'process.env': {
        NODE_ENV: JSON.stringify(process.env.NODE_ENV)
      }
    })
  ]
}

module.exports = config
