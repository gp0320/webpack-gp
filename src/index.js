import _ from 'lodash';
// import {findIndex} from 'lodash';
// var findIndex = require('lodash/findIndex') ;
import './style.css';
import Icon from './Icon.png';
import Data from './data.xml';

// app.js
import { a } from "./util";
console.log(a());



var users = [
  { 'user': 'barney',  'active': false },
  { 'user': 'fred',    'active': false },
  { 'user': 'pebbles', 'active': true }
];

let result = _.findIndex(users, { 'user': 'fred', 'active': false });
console.log(result)


function component() {
  var element = document.createElement('div');

  // Lodash, now imported by this script
  element.innerHTML = `sdasd`;
  element.classList.add('hello');

  let a = `dsdf`

  // 将图像添加到我们现有的 div。
  var myIcon = new Image();
  myIcon.src = Icon;

  //输出Data数据
  console.log(Data);
  element.appendChild(myIcon);

  return element;
}

document.body.appendChild(component());
