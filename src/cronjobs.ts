export default function (config: ServerConfig) {
	config.cronjobs.refreshPortals = [300, () => refreshPortals(config)];
}

async function refreshPortals(config: ServerConfig) {}
