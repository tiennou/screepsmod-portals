module.exports = function (config) {
	config.cronjobs.refreshPortals = [300, () => refreshPortals(config)]
}

async function refreshPortals(config) {

}
