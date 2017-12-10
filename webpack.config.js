var path = require('path');

module.exports = {
  entry: {
    app: './src/index.js'
  },
  output: {
    path: path.resolve(__dirname, 'lib'),
    filename: 'wassy.js',
    libraryTarget:'amd',
  },
  module: {
    loaders: [
      {
        test: /\.js$/,
        loader: 'babel-loader',
        query: {
          presets: ['es2015']
        },
      },
    ],
  },
  devtool: '#source-map'
};

