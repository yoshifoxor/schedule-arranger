// const webpack = require('webpack');
module.exports = {
  context: `${__dirname}/app`,
  mode: 'development',
  entry: './entry',
  output: {
    path: `${__dirname}/public/javascripts`,
    filename: 'bundle.js',
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: [{
            loader: 'babel-loader',
            options: {
              presets: ['@babel/preset-env'],
            },
          }],
      },
    ],
  },
  devtool: 'source-map',
};
