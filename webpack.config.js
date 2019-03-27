const webpack = require('webpack')
const path = require('path')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const MiniCssExtractPlugin = require("mini-css-extract-plugin")
const CompressionPlugin = require("compression-webpack-plugin")

const SRC = path.resolve(__dirname, 'src');
const NODE_ENV = process.env.NODE_ENV;

const isDev = () => {
  return (NODE_ENV === 'development');
};

const setPublicPath = () => {
  return isDev() ? '/' : '/bulma-resume-template/';
};

const setPath = function(folderName) {
  return path.join(__dirname, folderName);
};

const extractHTML = new HtmlWebpackPlugin({
  filename: 'index.html',
  inject: true,
  template: setPath('/src/index.ejs'),
  chunks: ['dracula'],
  minify: {
    removeAttributeQuotes: true,
    collapseWhitespace: true,
    html5: true,
    minifyCSS: true,
    removeComments: true,
    removeEmptyAttributes: true
  },
  environment: process.env.NODE_ENV
});

const extractHTMLLight = new HtmlWebpackPlugin({
  filename: 'light.html',
  inject: true,
  template: setPath('/src/light.ejs'),
  chunks: ['light'],
  minify: {
    removeAttributeQuotes: true,
    collapseWhitespace: true,
    html5: true,
    minifyCSS: true,
    removeComments: true,
    removeEmptyAttributes: true
  },
  environment: process.env.NODE_ENV
});

const plugins = [
  new webpack.DefinePlugin({
    'process.env': {
      isStaging: (isDev() || NODE_ENV === 'staging'),
      NODE_ENV: '"'+NODE_ENV+'"'
    }
  }),
  extractHTML,
  extractHTMLLight,
  new MiniCssExtractPlugin({
    filename: "[name].[hash].css"
  }),
  new CompressionPlugin({
    algorithm: 'gzip'
  })
]

module.exports = {
  entry: {
    dracula: './src/dracula-entry.js',
    light: './src/light-entry.js'
  },
  output: {
    path: isDev() ? path.resolve(__dirname) : setPath('dist'),
    publicPath: setPublicPath(),
    filename: isDev() ? '[name].js' : '[name].[hash].js'
  },
  mode: isDev() ? 'development' : 'production',
  optimization:{
    runtimeChunk: false,
    splitChunks: {
      chunks: "all",
    },
    // minimize: !isDev(),
    // minimizer: isDev() ? [
    //   new UglifyJsPlugin(),
    //   new OptimizeCSSAssetsPlugin({})
    // ] : []
  },
  resolve: {
    extensions: ['.js', '.json'],
    alias: {
      '@': SRC
    }
  },
  devServer: {
    historyApiFallback: true,
    noInfo: false
  },
  module: {
    rules: [
      {
        test: /\.(sa|sc|c)ss$/,
        use: [
          MiniCssExtractPlugin.loader,
          'css-loader',
          'sass-loader',
        ],
      },
      {
        test: /\.m?js$/,
        exclude: /(node_modules|bower_components)/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: ['@babel/preset-env']
          }
        }
      }
    ]
  },
  plugins,
}