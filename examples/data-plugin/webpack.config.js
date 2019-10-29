const CommonConfigWebpackPlugin = require('common-config-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {
  mode: 'development',
  devtool: 'inline-source-map',
  context: __dirname,
  entry: './src/index.ts',
  module: {
      rules: [
          {
              test: /\.tsx?$/,
              use: [
                {
                  loader: 'ts-loader',
                }
              ]
          }
      ]
  },
  resolve: {
      extensions: [ '.ts', '.tsx', '.js' ]
  },
  plugins: [
    new CommonConfigWebpackPlugin(),
    new HtmlWebpackPlugin({
      template: './public/index.html'
    })
  ],
};
