module.exports = function (config) {
	require('./cronjobs')(config)

	config.cli.on('cliSandbox', function (sandbox) {
		require('./cli')(config, sandbox);
	});
}
