const path = require('path')
const webpack = require('webpack')
const MiniCssExtractPlugin = require("mini-css-extract-plugin")
const HtmlWebpackPlugin = require('html-webpack-plugin')
const CleanWebpackPlugin = require('clean-webpack-plugin')
const CopyWebpackPlugin = require('copy-webpack-plugin')
const CompressionWebpackPlugin = require('compression-webpack-plugin')

const VueLoaderPlugin = require('vue-loader/lib/plugin')

const env = process.env.NODE_ENV ? process.env.NODE_ENV : 'production'
console.log(process.env.NODE_ENV)

module.exports = {
  entry: [
    "babel-polyfill",
    path.join(__dirname, './src/main.js')
  ],
  output: {
    path:path.join(__dirname, 'dist'),
    filename:'[name].[hash:8].js',
    chunkFilename: 'js/[name].[hash:8].js',
    // publicPath: '/'
  },
  resolve: {
    extensions: [
      '.css', '.js', '.vue', '.scss'
    ],
    // 模块别名地址，方便后续直接引用别名，无须写长长的地址，注意如果后续不能识别该别名，需要先设置root
    alias: {
      '@': path.resolve(__dirname, "./src")
    }
  },
  module: {
    rules: [
      {
        test: /\.vue$/,
        loader: 'vue-loader'
      },
      // {
      //   test: /\.html$/,
      //   use: [{
      //       loader: "html-loader",
      //       options: {
      //           minimize: true
      //       }
      //   }]
      // },
      {
        test: /\.(scss|css)$/,
        use: [
          'style-loader',
          env === 'development' ? 'style-loader' : MiniCssExtractPlugin.loader,
          'css-loader',
          {
            loader: 'postcss-loader',
            options: {
              config: {
                path: path.resolve(__dirname, './postcss.config.js')
              }
            }
          },
          'sass-loader'
        ]
      },
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: {
          loader: "babel-loader"
        }
      },
      {
        test: /\.(png|jpg|gif|svg|bmp|eot|woff|woff2|ttf)$/,
        loader: {
          loader: 'url-loader',
          options: {
            limit: 8 * 1024, // <limit值 用url-loader 否则默认用file-loader
            // outputPath: 'img/'
          }
        }
      }, {
        test: /\.(html|htm)/,
        loader:'html-withimg-loader'
      }  
    ]
  },
  plugins: [
    new CleanWebpackPlugin(['dist']),
    new VueLoaderPlugin(),
    new MiniCssExtractPlugin({
      filename: "css/[name].[hash:8].css",
      chunkFilename: "css/[id].css"
    }),
    new HtmlWebpackPlugin({
      template: "./index.html",
      filename: "./index.html",
      inject: true,
      // minify: {
      //   removeComments: true,
      //   collapseWhitespace: true,
      //   removeAttributeQuotes: true
      // },
      // chunksSortMode: 'dependency'
    }),
    // new CopyWebpackPlugin([{
    //   from: 'static',
    //   to: 'static/',
    //   force: true
    // }]),
    // new webpack.optimize.SplitChunksPlugin({
    //   cacheGroups: {
    //     default: {
    //       minChunks: 2,
    //       priority: -20,
    //       reuseExistingChunk: true
    //     },
    //     // 打包重复出现的代码
    //     vendor: {
    //       chunks: 'initial',
    //       minChunks: 2,
    //       maxInitialRequests: 5, // The default limit is too small to showcase the effect
    //       minSize: 0, // This is example is too small to create commons chunks
    //       name: 'vendor'
    //     }
    //   }
    // }),
    // new webpack.optimize.RuntimeChunkPlugin({name: 'manifest'}),
    // new CompressionWebpackPlugin({
    //   asset: '[path].gz[query]', //目标文件名
    //   algorithm: 'gzip', //使用gzip压缩
    //   test: new RegExp( //满足正则表达式的文件会被压缩
    //       '\\.(' + 'js|css' + ')$'),
    //   threshold: 10240, //资源文件大于10240B=10kB时会被压缩
    //   minRatio: 0.8 //最小压缩比达到0.8时才会被压缩
    // }),
  ],
  devtool: env === 'development' ? 'eval-source-map' : 'source-map',
  devServer: {
    open: false,
    // contentBase: path.join(__dirname, './dist'), // 配置开发服务运行时的文件根目录
    host: 'localhost', // 开发服务器监听的主机地址
    compress: false, // 开发服务器是否启动gzip等压缩
    overlay: false,
    port: 8080, // 开发服务器监听的端口,
    proxy: {
      '/': {
        target: 'http://10.100.101.103:3000/manager/v1/',
        changeOrigin: true,
        secure: false
      }
    }
  }  
}
