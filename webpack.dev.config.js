/**
 * Created by cherish on 2018/1/8.
 */
const webpack = require("webpack");
const path = require("path");

const HtmlWebPackPlugin = require("html-webpack-plugin");//打包html

const ModuleConcatenationPlugin = require("webpack/lib/optimize/ModuleConcatenationPlugin");


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

    },

  //输出
  output: {
    //[name]会使用在入口entry中定义的属性名称作为参数传入
    filename: '[name].[hash:7].js',
    path: path.resolve(__dirname, 'dist'),
    //用于启动server服务所需配置
    publicPath: '/'
  },


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

          'style-loader' ,
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

      new webpack.NamedModulesPlugin(),  // 用于开发环境 热更新

      new ModuleConcatenationPlugin(), //作用于提升


        //添加HtmlWebpackPlgin插件
        //HtmlWebpackPlugin插件会在dist目录下创建了一个全新的文件，所有的 自动生成的bundle文件 会全部自动添加到 新建的html 中
      new HtmlWebPackPlugin({
        template: "./src/index.html",
        filename: "./index.html"
      }),




    ]


}
}
