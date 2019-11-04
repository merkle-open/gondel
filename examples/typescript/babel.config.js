module.exports = {
  presets: [
    [require.resolve('@babel/preset-env'), {
      "modules": false,
      "targets": {
        "ie": 9
      }
    }]
  ],
  plugins: [
    [require.resolve('@babel/plugin-proposal-decorators'), {legacy: true}],
    'transform-class-properties',
  ],
};
