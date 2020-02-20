module.exports = {
	presets: [[require.resolve('@babel/preset-env'), { useBuiltIns: 'entry', corejs: 2 }]],
	plugins: [
		[require.resolve('@babel/plugin-proposal-decorators'), { legacy: true }],
    'transform-class-properties',
	],
};
