export default {
  input: 'dist/index.js',
  output: {
    format: 'umd',
    name: 'gondel',
    file: 'dist/gondel.es5.js',
    sourcemap: true,
    banner: '/// <reference path="./index.d.ts" />'
  }
};
