const babel = require('babel-core');
const types = require('babel-types');

const code = 'let sum =(a,b)=>a+b';


const visitor = {
    ArrowFunctionExpression(path) {
        console.log(11111, path);
    },
};

const arrayPlugin = { visitor };

const result = babel.transform(code, {

    plugins: [
        arrayPlugin,
    ],
    presets: [
        [
            'env',
            {
                // "loose": true,
                // "modules": false
            },
        ],
    ],
});

console.log(result);
