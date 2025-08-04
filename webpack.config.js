// ./webpack.config.js
const loader = require('css-loader');
const HtmlWebPackPlugin = require( 'html-webpack-plugin' );
const path = require( 'path' );

module.exports = {
  mode: "development",
  entry: {
    drupalIsearchViewer: "./src/indexDrupal.js",
    wpIsearchViewer: "./src/indexWordpress.js",
  },
  output: {
    path: path.resolve(__dirname, "dist"),
    filename: '[name].js',
    publicPath: '/',
    hashFunction: "sha256",
  },
  devServer: {
    historyApiFallback: true,
    hot: true
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: "babel-loader"
      },
      {
        test: /\.css$/,
        use: [
          'style-loader',
          'css-loader'
        ]
      },
      {
        test: /\.(png|jpe?g|gif)$/i,
        use: [
          {
            loader: 'file-loader'
          }
        ]
      }
    ]
  },
  plugins: [
    new HtmlWebPackPlugin({
      template: path.resolve( __dirname, 'public/drupal.html' ),
      filename: 'drupal.html',
      inject: false,
      hash: true,
    }),
    new HtmlWebPackPlugin({
      template: path.resolve( __dirname, 'public/example.html' ),
      filename: 'example.html',
      inject: false,
    })
  ],
  externals: {
    react: 'React',
    'react-dom': 'ReactDOM',
  },
  optimization: {
    splitChunks: {
      cacheGroups: {
        vendor: {
          test: /[\\/]node_modules[\\/](react|react-dom)[\\/]/,
          name: 'vendor',
          chunks: 'all',
        },
      },
    },
  },
};
