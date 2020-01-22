const CommonConfigWebpackPlugin = require('common-config-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {
  mode: 'development',
  devtool: 'cheap-module-eval-source-map',
  context: __dirname,
  entry: './src/index.ts',
  resolve: {
    extensions: ['.ts', '.js']
  },
  module: {
    rules: [
      {
        test: /\.html$/,
        loader: 'html-loader'
      },
      {
        test: /\.ts$/,
        loaders: [
            'babel-loader',
            {
                loader: 'awesome-typescript-loader',
                options: {
                    configFileName: 'tsconfig.json'
                }
            },
            'angular2-template-loader'
        ],
        exclude: [/node_modules/]
    }
    ]
  },
  devServer: {
    historyApiFallback: true,
    stats: 'minimal'
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: './index.html'
    })
  ],
};
