const path = require('path');
const CopyWebpackPlugin = require('copy-webpack-plugin');
// const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {
  mode: 'development',
  entry: './src/index.js',
  target: 'node',
  output: {
    filename: 'main.js',
    path: path.resolve(__dirname, 'dist'),
  },
  resolve: {
    extensions: ['.js'],
  },

  plugins: [
    new CopyWebpackPlugin([
      { from: './src/views', to: 'views' },
    ]),
  ],

  module: {
    rules: [
      { test: /\.js$/, use: ['babel-loader'], exclude: ['/node_modules'] },
      { test: /\.css$/, use: ['style-loader', 'css-loader'] },
      { test: /\.ejs$/, use: ['ejs-loader?variable=data'] },
    ],
  },
};
