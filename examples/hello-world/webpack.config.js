const JsConfigWebpackPlugin = require('js-config-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {
  mode: 'development',
  devtool: 'inline-source-map',
  context: __dirname,
  entry: './src/index.js',
  plugins: [
    new JsConfigWebpackPlugin(),
    new HtmlWebpackPlugin({
      template: './index.html'
    })
  ],
};
