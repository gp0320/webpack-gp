## webpack 构建教程

##### 忽略不用的lodash

```
npm i --save-dev lodash-webpack-plugin  babel-plugin-lodash
```

在项目文件中无论哪种引用 都会非常小 只打包用到的
```
import _ from 'lodash';
import {findIndex} from 'lodash';
var findIndex = require('lodash/findIndex') ;

```


##### 生产环境使用 MiniCssExtractPlugin 生产环境不用style-loader
```
{
        loader: "style-loader"
                }
```
*  先用了 extract-text-webpack-plugin 这个插件 提示 Tab的方法版本过老
于是用了 MiniCssExtractPlugin 。作用是用link引用的方式加载css 放到head.

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


##### V4版本 默认开启 tree-shaking，可以手动关闭
*   无需再手动引入 UglifyjsWebpackPlugin
开启条件：
```
  optimization: {
      minimize: true, // 改为false 就不压缩 也不 sharking 代码
```

##### 在路由懒加载的基础上 进一步懒加载需要的代码
*   `import()`
```
   element.onclick = function (e) {
     //模拟懒加载，按需加载print模块
     import(/* webpackChunkName: "shijie" */ './print').then(function (module) {
       var print = module.default;
       print(e);
       console.dir(module);
     });
     // import("lodash").then((_) => {
     //   var br = document.createElement('br');
     //   var button = document.createElement('button');
     //   button.innerHTML = _.join(['你好', 'webpack',(new Date()).getTime()], ' ');
     //   document.body.appendChild(br);
     //   document.body.appendChild(button);
     //
     // });
   }
```

*   `.babelrc` 添加 `stage-0`
```
  {
    "presets": [
      "stage-0",
      [
        "env",
        {
          "modules": false
        }
      ]
    ],
    "plugins": [
      "lodash","transform-runtime"
    ]
  }
```

##### 添加 husky 格式化commit
*
安装 husky 时会触发 这个包的install,然后自动修改.git里面的hooks
*   `package.json` 里面需要添加的代码
```
"husky": {
    "hooks": {
        "pre-commit": "lint-staged",
        "commit-msg": "node scripts/verifyCommitMsg.js"
    }
  },
  "lint-staged": {
    "*.js": [
      "yarn lint",
      "git add"
    ]
  },
```
`scripts/verifyCommitMsg.js` 里面的代码
```
#!/usr/bin/env node
const chalk = require('chalk')
const msgPath = process.env.HUSKY_GIT_PARAMS
const msg = require('fs').readFileSync(msgPath, 'utf-8').trim()

const commitRE = /^(revert: |Merge branch)?(feat|fix|docs|style|refactor|perf|test|workflow|ci|chore|types|merge)(\(.+\))?: .{1,50}/

if (!commitRE.test(msg)) {
  console.log()
  console.error(
    `  ${chalk.bgRed.white(' ERROR ')} ${chalk.red(`invalid commit message format.`)}\n\n` +
    chalk.red(`  Proper commit message format is required for automated changelog generation. Examples:\n\n`) +
    `    ${chalk.green(`feat(compiler): add 'comments' option`)}\n` +
    `    ${chalk.green(`fix(v-model): handle events on blur (close #28)`)}\n\n` +
    chalk.red(`  See .gitlab/COMMIT_CONVENTION.md for more details.\n`) +
    chalk.red(`  You can also use ${chalk.cyan(`npm run commit`)} to interactively generate a commit message.\n`)
  )
  process.exit(1)
}
```

##### 添加 url-loader 小图直接base64
*
url-loader 的内部fallback（回退策略）是用 file-loader，so 只写url-loader即可
```
    //添加图片文件处理规则
      {
        test: /\.(png|svg|jpg|gif)$/,
        use: {
          // loader: 'file-loader',
          loader: 'url-loader',
          options: {
            limit: 222212,
            // outputPath: 'images'
          }
        }
      },


      <!-- 源码-->
        // No limit or within the specified limit
        if (!limit || src.length < limit) {
          if (typeof src === 'string') {
            src = Buffer.from(src);
          }

          return `module.exports = ${JSON.stringify(`data:${mimetype || ''};base64,${src.toString('base64')}`)}`;
        }
        当小于限制的时候 就base64
```

##### oneOf 用法
* use 是从后往前依次调用，oneOf 是从前往后，匹配到只调用第一个，所以要把匹配的范围最小写在前面。以css的loader举例：
```
         {
           test: /\.(css)$/,
           oneOf: [
             // 第一个loader ，匹配 import './mm.css?module';查询字符串有module的
             // 匹配成功会调用MiniCssExtractPlugin，以外链形式
             {
               resourceQuery: /module/,
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
         }
```
* `index.js` 引入的css
```
import './style.css';
import './mm.css?module';

// mm.css
.mm {
    text-align: right;
    line-height: 9;

}
body{
    background-color: red;
}
// mm.css-end


// style.css
.hello {
    color: red;
    background: url('./Icon.png');
}
// style.css -end
```

* build 生成结果
```
// 2.6c86d171251e183ccccc.css   由 mm.css 生成后
.mm_mm_KTdwN{text-align:right;line-height:9}body{background-color:red}

// styles.6c86d17.js 由 style.css 生成后
(o.exports=r(4)(!1)).push([o.i,".hello {\n    color: red;\n    background: url("+s(r(0))+");\n}",""])

```
