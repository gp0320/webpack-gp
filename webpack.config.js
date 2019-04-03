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
    filename: '[name].[hash:7].js',
    path: path.resolve(__dirname, 'dist'),
    //用于启动server服务所需配置
    publicPath: './'
  },


    //将编译后的代码映射回原始源代码。如果一个错误来自于 b.js，source map 就会明确的告诉你
    //不推荐在生产环境加入该配置
    //亲测发现只支持chrome浏览器有用
    //前提是需要在package.json文件中scripts下面加入"watch": "webpack --watch"
    //使用cnpm run watch 开启此开发模式
    // devtool: 'inline-source-map',
    //修改代码的同时，浏览器自动刷新
    //告诉开发服务器(dev server)，在哪里查找文件：
    //能够自动刷新浏览器,前提是安装npm install --save-dev webpack-dev-server
    //同时需要在package.json文件中scripts下面加入"start": "webpack-dev-server --open"
    //使用cnpm start
   devServer: {
     overlay: {
       warnings: true,
       errors: true
     }, //在页面上全屏输出警告和错误的覆盖
     compress: false, //一切服务器都使用gzip压缩
     progress: false, //显示webpack构建进度
     // historyApiFallback: true, //启用html5 history route
     disableHostCheck: true,
     port: 9898,
     hot: true,
     open: true,//自动打开浏览器
     inline: true,
     host: "127.0.0.1",


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
        test: /\.(css|scss|less)$/,
        use: [

          devMode  ? 'style-loader' : MiniCssExtractPlugin.loader,
          {
            loader: "css-loader"
          }]
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

      new webpack.NamedModulesPlugin(),  // 用于开发环境 热更新

      new ModuleConcatenationPlugin(), //作用于提升

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
        filename: "css/[name].[hash:7].css",
        chunkFilename: "[id].[hash].css"
      }),
      new OptimizeCssAssetsPlugin({
        assetNameRegExp: /\.css$/g,
        cssProcessor: require("cssnano"),
        cssProcessorOptions: { discardComments: { removeAll: true } },
        canPrint: true
      }),

    ],


  optimization: {
      //优化，代码拆分，分离公共文件和业务文件
      minimize: false,
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
              }
              /*styles: {
               name: "styles",
               test: /.(scss|css)$/,
               chunks: "all",
               minChunks: 1,
               reuseExistingChunk: true,
               enforce: true
               }*/
          }
      }
  }


}
}
