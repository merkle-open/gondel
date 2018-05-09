import resolve from 'rollup-plugin-node-resolve';
import uglify from 'rollup-plugin-uglify';

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
    uglify()
  ],
  external: [
    'jquery'
  ]
};
