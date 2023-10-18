const TsConfigWebpackPlugin = require('ts-config-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');

// hack: OpenSSL 3 does not support md4 anymore, but legacy webpack 4 hardcoded it: https://github.com/webpack/webpack/issues/13572
const crypto = require('crypto');
const crypto_orig_createHash = crypto.createHash;
crypto.createHash = algorithm => crypto_orig_createHash(algorithm === 'md4' ? 'sha256' : algorithm);

module.exports = {
  mode: 'development',
  devtool: 'inline-source-map',
  devServer: {
		allowedHosts: ['.codesandbox.io', '.csb.app'],
	},
  context: __dirname,
  entry: './src/index.ts',
  plugins: [
    new TsConfigWebpackPlugin(),
    new HtmlWebpackPlugin({
      template: './index.html'
    })
  ],
};
