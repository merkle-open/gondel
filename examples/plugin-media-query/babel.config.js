module.exports = {
  presets: [[require.resolve('@babel/preset-env'), { useBuiltIns: 'usage', corejs: 3 }]],
  plugins: [
    [require.resolve('@babel/plugin-proposal-decorators'), { legacy: true }],
  ],
};
