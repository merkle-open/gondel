import terser from '@rollup/plugin-terser';

export default {
  input: 'dist/index.js',
  output: {
    format: 'umd',
    name: 'gondel',
    file: 'dist/gondel.es5.min.js',
    sourcemap: true,
  },
  plugins: [
    terser(),
  ]
};
