const path = require('node:path');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');

module.exports = {
  context: `${__dirname}/app`,
  mode: 'development',
  entry: './entry',
  output: {
    clean: true,
    path: path.resolve(__dirname, 'public'),
    filename: 'javascripts/[name].bundle.js',
  },
  plugins: [
    new MiniCssExtractPlugin({
      filename: 'stylesheets/bundle.css'
    })
  ],
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: ['@babel/preset-env']
          }
        }
      },
      {
        test: /\.css$/,
        use: [MiniCssExtractPlugin.loader, 'css-loader']
      }
    ]
  },
    devtool: 'source-map',

};
