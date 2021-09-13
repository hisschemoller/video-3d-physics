const path = require('path');

module.exports = {
  entry: './src/main.ts',
  devtool: 'inline-source-map',
  mode: 'development',
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        use: 'ts-loader',
        exclude: /node_modules/,
      },
    ],
  },
  resolve: {
    alias: {
      '@app': path.resolve(__dirname, 'src/app'),
      '@projects': path.resolve(__dirname, 'public/projects'),
    },
    extensions: ['.tsx', '.ts', '.js'],
  },
  output: {
    filename: 'js/bundle.js',
    path: path.resolve(__dirname, 'public'),
  },
  watchOptions: {
    ignored: /node_modules/,
  },
};
