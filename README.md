## webpack 构建教程

##### 忽略不用的lodash

```
npm i --save-dev lodash-webpack-plugin  babel-plugin-lodash
```

在项目文件中无论哪种引用 都会非常小 只打包用到的
```
import _ from 'lodash';
// import {findIndex} from 'lodash';
// var findIndex = require('lodash/findIndex') ;

```


##### 生产环境不用style-loader
```
{
        loader: "style-loader"
                }
```
*  先用了 extract-text-webpack-plugin 这个插件 提示 Tab的方法版本过老，
于是用了 MiniCssExtractPlugin 。作用是用引用的方式提到css 放到index.html.

```

module.exports = (env, argv) => {

  let devMode = true
  if (argv.mode === 'development') {
  }

  if (argv.mode === 'production') {
    devMode = false
  }

  console.log('devMode',devMode)

 .............
 devMode  ? 'style-loader' : MiniCssExtractPlugin.loader,

```

*  style-loader 是动态创建style 插件Css。 既然已经在外引用了css，不需要style-loader.


##### V4版本 默认开始 tree-shaking
*   不用再引入 UglifyjsWebpackPlugin
开启条件：
```
  optimization: {
      minimize: true, // 我改为false 就不压缩 也不 sharking 代码
```
