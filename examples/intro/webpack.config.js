const HtmlWebpackPlugin = require('html-webpack-plugin');
const CommonConfigWebpackPlugin = require('common-config-webpack-plugin');

module.exports = {
  mode: 'development',
  devtool: 'inline-source-map',
  context: __dirname,
  entry: './src/index.js',
  plugins: [
    new CommonConfigWebpackPlugin(),
    new HtmlWebpackPlugin({
      template: 'src/index.html'
    })
  ],
};
