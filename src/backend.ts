import cli from './cli';
import cronjobs from './cronjobs';

export default function (config: ServerConfig) {
	cronjobs(config);

	config.cli.on('cliSandbox', function (sandbox: CliSandbox) {
		cli(config, sandbox);
	});
}
