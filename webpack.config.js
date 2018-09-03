var path = require('path');

module.exports = {
  mode: 'production',
  entry: {
    app: './src/index.js'
  },
  output: {
    path: path.resolve(__dirname, 'lib'),
    filename: 'wassy.min.js',
    // libraryTarget:'commonjs2',
    libraryTarget: 'umd',
    library: 'wassy',
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        use: [
          {
            loader: 'babel-loader',
          },
        ],
      },
    ],
  },
  devtool: '#source-map'
};

