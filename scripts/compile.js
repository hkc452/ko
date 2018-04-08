const babel = require('babel-core');
const fs = require('fs');
const path = require('path')
const babelOptions = JSON.parse(fs.readFileSync(
    path.resolve(__dirname, '..', '.babelrc'),
    'utf8'
));
babelOptions.babelrc = false;
const transformed = babel.transformFileSync(path.resolve(__dirname, '..', 'index.js'), babelOptions).code;
console.log(transformed)