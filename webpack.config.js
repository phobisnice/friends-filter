const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const WebpackMd5Hash = require('webpack-md5-hash');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const CleanWebpackPlugin = require('clean-webpack-plugin');

module.exports = {
  entry: [ '@babel/polyfill', './src/index.js' ],
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: '[name].[chunkhash].js'
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: {
          loader: "babel-loader",
          options: {
            presets: [
              ['@babel/preset-env']
            ]
          }
        }
      },
      {
        test: /\.scss$/,
        use:  ['style-loader', MiniCssExtractPlugin.loader, 'css-loader', 'postcss-loader', 'sass-loader']

      },
      {
          test: /\.hbs/,
          loader: 'handlebars-loader',
          exclude: /node_modules/
      },
      {
        test: /\.(png|svg|jpg|gif)$/,
        use: [{loader: 'file-loader'}]
      }
    ]
  },
  plugins: [ 
    new CleanWebpackPlugin('dist', {} ),
    new MiniCssExtractPlugin({
        filename: 'style.[contenthash].css',
    }),
    new HtmlWebpackPlugin({
        inject: false,
        hash: true,
        title: 'Friends filter',
        template: './src/index.html',
        filename: 'index.html'
    }),
    new WebpackMd5Hash()
  ]
};

