import resolve from 'rollup-plugin-node-resolve';

export default {
  input: 'dist/index.js',
  output: {
    format: 'umd',
    name: 'gondelPluginStorage',
    file: 'dist/index.es5.js',
    sourcemap: true,
    banner: '/// <reference path="./index.d.ts" />',
    globals: {
        // FIXME: what should we do with the warning about ext. module?
        '@gondel/core': 'gondel',
        'tslib': 'tslib'
    }
  },
  external: ['@gondel/core'],
  plugins: [
    resolve()
  ]
};
