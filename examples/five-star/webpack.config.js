const JsConfigWebpackPlugin = require('js-config-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');

// hack: OpenSSL 3 does not support md4 anymore, but legacy webpack 4 hardcoded it: https://github.com/webpack/webpack/issues/13572
const crypto = require('crypto');
const crypto_orig_createHash = crypto.createHash;
crypto.createHash = algorithm => crypto_orig_createHash(algorithm === 'md4' ? 'sha256' : algorithm);

module.exports = {
  mode: 'development',
  devtool: 'inline-source-map',
  context: __dirname,
  entry: './src/index.js',
  module: {
    rules: [
      {
        test: /\.css$/i,
        use: ['style-loader', 'css-loader'],
      }
    ]
  },
  plugins: [
    new JsConfigWebpackPlugin(),
    new HtmlWebpackPlugin({
      template: './index.html'
    })
  ],
};
