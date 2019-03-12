let  babel = require('babel-core')
let  types = require('babel-types')

let code = `let sum =(a,b)=>a+b`


let visitor = {
  ArrowFunctionExpression(path){
    console.log(11111,path)
  }
}

let arrayPlugin = {visitor}

let result = babel.transform(code, {

  plugins: [
    arrayPlugin
  ],
  presets: [
    [
      "env",
      {
        // "loose": true,
        // "modules": false
      }
    ]
  ]
})

console.log(result)
