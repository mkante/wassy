
var rootDir = __dirname+"/..";

module.exports = {
  entry: {
    app: './index.js'
  },
  output: {
    path: './lib',
    filename: 'wassy.js',
    libraryTarget:'amd'
  },
  module: {
    loaders: [
      //{ test: /\.js$/, exclude: /node_modules/, loader: 'val'},
      //{ test: /\.css$/, loader: 'style-loader!css-loader' }
    ]
  },
  devtool: '#source-map'
}
