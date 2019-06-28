/**
 * Created by cherish on 2018/1/8.
 */
const webpack = require("webpack");
const path = require("path");
const CleanWebpackPlugin = require("clean-webpack-plugin"); //删除之前的打包文件

const HtmlWebPackPlugin = require("html-webpack-plugin");//打包html
const ManifestPlugin = require('webpack-manifest-plugin');

const ModuleConcatenationPlugin = require("webpack/lib/optimize/ModuleConcatenationPlugin");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");


const OptimizeCssAssetsPlugin = require("optimize-css-assets-webpack-plugin");

// var utils = require('./utils')


var LodashModuleReplacementPlugin = require('lodash-webpack-plugin');




module.exports = (env, argv) => {

  let devMode = true
  if (argv.mode === 'development') {
  }

  if (argv.mode === 'production') {
    devMode = false
  }

  console.log('devMode',devMode)

 return  {

    //入口
    entry: {
        app: './src/index.js',
        //print: './src/print.js',
        //test: './src/test.js'
    },

  //输出
  output: {
    //[name]会使用在入口entry中定义的属性名称作为参数传入
    filename: '[name].[chunkhash:7].js',
    path: path.resolve(__dirname, 'dist'),
    //用于启动server服务所需配置
    publicPath: './'
  },

  module: {
    rules: [

      {
      test: /\.(js|jsx)$/,
      exclude: /node_modules/,
      use: [{
        loader: "babel-loader"
      }]
    },
      {
        test: /\.html$/,
        exclude: /node_modules/,
        use: {
          loader: "html-loader",
          options: {
            minimize: true
          }
        }
      },
      {
        test: /\.(css)$/,
        oneOf: [
          // 第一个loader ，匹配 import './mm.css?module';查询字符串有module的
          // 匹配成功会调用MiniCssExtractPlugin，以外链形式
          {
            // resourceQuery: /module/,
            use: [
              MiniCssExtractPlugin.loader,
              {
                loader: "css-loader",
                options: {
                  sourceMap: false,
                  importLoaders: 2,
                  modules: true,
                  localIdentName: '[name]_[local]_[hash:base64:5]'
                }
              },
            ]
          },
          // 第二个loader ，匹配所有的，会创建<style>...</style> 放在header
          {
            use: [
              'style-loader',
              {
                loader: "css-loader",
              },
            ]
          }] //  end
      },
      {
        test: /\.(png|jpg|svg|gif)$/,
        use: [{
          loader: "url-loader",
          options: {
            limit: 500,
            publicPath:  "/image",//文件引入路径
            outputPath: "image",//打包文件路径
            name: "[name].[ext]"
          }
        }]
      },
      {
        test: /\.(woff|woff2|eot|ttr|otf|ttf|svg)/,
        use: ["url-loader"]
      },
      //添加xml文件处理规则
      {
        test: /\.xml$/,
        use: [
          'xml-loader'
        ]
      }]
  },

    plugins: [
        //该插件作用是在每次执行cnpm run build构建命令之后，对应目录下所有的文件都会被删除，保证该目录生成的文件是最新的，同时一些没有用到的文件也不用维护
        new CleanWebpackPlugin(['dist']),

      // new ModuleConcatenationPlugin(), //作用于提升

      new LodashModuleReplacementPlugin,

        //添加HtmlWebpackPlgin插件
        //HtmlWebpackPlugin插件会在dist目录下创建了一个全新的文件，所有的 自动生成的bundle文件 会全部自动添加到 新建的html 中
      new HtmlWebPackPlugin({
        template: "./src/index.html",
        filename: "./index.html"
      }),
        //该插件可以显示出编译之前的文件和编译之后的文件的映射
        new ManifestPlugin({
            fileName: 'manifest.json',
            basePath: "/dist/",
        }),
      new MiniCssExtractPlugin({
        filename: "css/[name].[contenthash:7].css",
        chunkFilename: "[id].[contenthash:7].css"
      }),
      // new OptimizeCssAssetsPlugin({
      //   assetNameRegExp: /\.css$/g,
      //   cssProcessor: require("cssnano"),
      //   cssProcessorOptions: { discardComments: { removeAll: true } },
      //   canPrint: true
      // }),

    ],


  optimization: {
      //优化，代码拆分，分离公共文件和业务文件
      minimize: false,
		// minimizer: [],

      splitChunks: {
          chunks: "all",//Webpack 4 只会对按需加载的代码做分割,如果我们需要配置初始加载的代码也加入到代码分割中，可以设置 splitChunks.chunks 为 'all'
          cacheGroups: {
              //  提取node_modules中代码
              vendors: {
                  test: /[\\/]node_modules[\\/]/,
                  name: "vendors",
                  chunks: "all", //显示块的范围，initial(初始块)、async(按需加载块)、all(全部块)
                  priority: 10,
                  enforce: true
              },
              commons: {
                  // async 设置提取异步代码中的公用代码
                  chunks: "all",
                  name: "common",// 拆分出来的块的名字
                  priority: 10,
                  minSize: 0,// 表示压缩前的最小模块的大侠，默认1
                  minChunks: 2,// 表示被引用次数，至少为两个 chunks 的公用代码
                  maxAsyncRequests: 1,// 最大的按需异步加载次数，默认为1
                  maxInitialRequests: 1// 最大的初始化加载次数
                  /*  cacheGroups: {
                   priority: 1,//缓存的优先级
                   test: '', //缓存组的规则，表示符合条件的放入当前缓存组，值可以是function，boolean，string，regext，默认为null
                   reuseExistingChunk:"",//表示已经使用
                   }, // 缓存组 参数chunks，minSize，minChunks，maxAsyncRequests，maxInitialRequests，name, */
              },
              styles: {
               name: "styles",
               test: /.(scss|css)$/,
               chunks: "all",
               minChunks: 1,
               reuseExistingChunk: true,
               enforce: true
               }
          }
      }
  }


}
}
