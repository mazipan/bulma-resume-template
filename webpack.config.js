const webpack = require('webpack')
const path = require('path')
const glob = require('glob')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const MiniCssExtractPlugin = require("mini-css-extract-plugin")
const CompressionPlugin = require("compression-webpack-plugin")
const TerserJSPlugin = require('terser-webpack-plugin');
const OptimizeCSSAssetsPlugin = require('optimize-css-assets-webpack-plugin');
const PurgecssPlugin = require('purgecss-webpack-plugin')

const content = require('./src/data')

const SRC = path.resolve(__dirname, 'src');

const PATHS = {
  src: SRC
}

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

const htmlPlugin = (inputTemplatePath, outputFileName, chunkPattern) => {
  return new HtmlWebpackPlugin({
    filename: outputFileName,
    inject: true,
    template: setPath(inputTemplatePath),
    chunks: [
      chunkPattern
    ],
    templateParameters: {
      content
    },
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
}

const plugins = [
  new webpack.DefinePlugin({
    'process.env': {
      NODE_ENV: '"'+NODE_ENV+'"'
    }
  }),
  htmlPlugin('/src/index.ejs', 'index.html', 'dracula'),
  htmlPlugin('/src/light.ejs', 'light.html', 'light'),
  new MiniCssExtractPlugin({
    filename: "[name].[hash].css"
  }),
  new PurgecssPlugin({
    paths: glob.sync(`${PATHS.src}/*`)
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
    minimizer: [new TerserJSPlugin({}), new OptimizeCSSAssetsPlugin({})],
    runtimeChunk: false,
    splitChunks: {
      chunks: "all",
    }
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
        exclude: /(node_modules)/,
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