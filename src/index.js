// import _ from 'lodash';
// import {findIndex} from 'lodash';
// var findIndex = require('lodash/findIndex') ;

import './style.css';
import Icon from './Icon.png';
import Data from './data.xml';

// app.js
import { a } from "./tree-shaking.js";
console.log(a());



// var users = [
//   { 'user': 'barney',  'active': false },
//   { 'user': 'fred',    'active': false },
//   { 'user': 'pebbles', 'active': true }
// ];
//
// let result = _.findIndex(users, { 'user': 'fred', 'active': false });
// console.log(result)


function component() {
  var element = document.createElement('div');

  // Lodash, now imported by this script
  element.innerHTML = `sdasd`;
  element.classList.add('hello');

  let a = `dsdf`

  // 将图像添加到我们现有的 div。
  var myIcon = new Image();
  myIcon.src = Icon;


  element.appendChild(myIcon);


  //写法一：
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
  };


  return element;
}

document.body.appendChild(component());


