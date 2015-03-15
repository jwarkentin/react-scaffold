// ================================================================================================== //
//
// For react hot loader boiler plate, check out: https://github.com/gaearon/react-hot-boilerplate
//

var webpack = require('webpack'),
    qsUtils = require('querystring');

var NODE_ENV = process.env.NODE_ENV;

var appBabelQs = qsUtils.stringify({
  experimental: 'true',
  //playground: 'true',
  'optional[]': [
    'runtime',
    'validation.undeclaredVariableCheck',
    'utility.inlineExpressions',
    NODE_ENV === 'production' ? 'utility.deadCodeElimination' : null
  ].filter(function(x) { return Boolean(x); })
}, null, null, {
  encodeURIComponent: function(c) { return c; }
});

var modBabelQs = qsUtils.stringify({
  experimental: 'true',
  'optional[]': [
    'runtime',
    'utility.inlineExpressions',
    NODE_ENV === 'production' ? 'utility.deadCodeElimination' : null
  ].filter(function(x) { return Boolean(x); })
}, null, null, {
  encodeURIComponent: function(c) { return c; }
});


module.exports = {
  entry: [
    'webpack-dev-server/client?http://0.0.0.0:3000',
    'webpack/hot/only-dev-server',
    './main.jsx'
  ],
  output: {
    path: __dirname + '/public/build/',
    filename: 'bundle.js',
    publicPath: 'http://localhost:3000/public/build/'
  },
  module: {
    loaders: [
      {
        test: /node_modules.*\\.jsx?$/,
        loader: 'babel-loader?' + modBabelQs
      },
      {
        test: /\.jsx?$/,
        exclude: /node_modules/,
        loaders: ['react-hot', 'babel-loader?' + appBabelQs, 'flowcheck']
      }
    ]
  },
  plugins: [
    NODE_ENV !== 'production' ? new webpack.HotModuleReplacementPlugin() : null,
    NODE_ENV === 'production'
      ? new webpack.optimize.UglifyJsPlugin({
        sourceMap: true,
        compress: {
          warnings: false
        }
      })
      : null
  ].filter(function(x) { return Boolean(x); }),
  devtool: NODE_ENV !== 'production' ? 'source-map' : null
};