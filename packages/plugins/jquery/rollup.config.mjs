import { nodeResolve } from '@rollup/plugin-node-resolve';
import terser from '@rollup/plugin-terser';

export default {
  input: 'dist/index.js',
  output: {
    format: 'umd',
    name: 'gondelPluginJQuery',
    file: 'dist/index.es5.js',
    sourcemap: true,
  },
  plugins: [
    nodeResolve({
      extensions: ['.ts'],
    }),
    terser(),
  ],
  external: [
    'jquery',
  ]
};
