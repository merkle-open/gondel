import resolve from 'rollup-plugin-node-resolve';
import { terser } from 'rollup-plugin-terser';

export default {
  input: 'dist/index.js',
  output: {
    format: 'umd',
    name: 'gondelPluginJQuery',
    file: 'dist/index.es5.js',
    sourcemap: true,
  },
  plugins: [
    resolve({
      extensions: ['.ts'],
    }),
    terser(),
  ],
  external: [
    'jquery',
  ]
};
