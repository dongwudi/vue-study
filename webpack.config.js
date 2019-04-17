const path = require('path');
const htmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {
  mode: 'development',
  entry: './src/main.js',
  output:{
    filename: 'bundle.js',
    path: path.resolve(__dirname,'dist')
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        loader: 'babel-loader',
        exclude: /(node_modules)/
      }
    ]
  },
  plugins:[
    new htmlWebpackPlugin({
      template: './index.html',
      filename: './dist/index.html'
    })
  ],
  devServer: {
    contentBase: path.resolve(__dirname,'./dist'),
    open: true,
    port: 9000,
    hot: true
  }
}