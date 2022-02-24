import resolve from 'rollup-plugin-node-resolve';

export default {
  input: 'dist/index.js',
  output: {
    format: 'umd',
    name: 'gondelPluginMediaQueries',
    file: 'dist/index.es5.js',
    sourcemap: true,
    banner: '/// <reference path="./index.d.ts" />',
  },
  plugins: [
    resolve(),
  ]
};
