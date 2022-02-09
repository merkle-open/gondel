import { terser } from 'rollup-plugin-terser';
import resolve from 'rollup-plugin-node-resolve';

export default {
  input: 'dist/index.js',
  output: {
    format: 'umd',
    name: 'gondelPluginEvents',
    file: 'dist/index.es5.js',
    sourcemap: true,
    banner: '/// <reference path="./index.d.ts" />',
  },
  plugins: [
    resolve(),
    terser(),
  ]
};
