const TsConfigWebpackPlugin = require('ts-config-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {
  mode: 'development',
  devtool: 'inline-source-map',
  context: __dirname,
  entry: './src/index.ts',
  plugins: [
    new TsConfigWebpackPlugin(),
    new HtmlWebpackPlugin({
      template: './index.html'
    })
  ],
};
