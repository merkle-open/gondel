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
        test: /\.ts$/,
        loaders: [
            'babel-loader',
            {
                loader: 'awesome-typescript-loader',
                options: {
                    configFileName: 'tsconfig.json'
                }
            },
            'angular2-template-loader?keepUrl=true'
        ],
        exclude: [/node_modules/]
      },
      {
        test: /\.(html|css)$/,
        loader: 'raw-loader',
        exclude: /\.async\.(html|css)$/
      },
      {
        test: /\.async\.(html|css)$/,
        loaders: [
          {
            loader: 'file-loader',
            options: {
              name: '[name].[hash].[ext]',
            },
          },
          'extract-loader'
        ],
        exclude: [/index.html/]
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
