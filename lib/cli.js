const q = require("q");
const { isRoomName, getPos, serverRequire } = require("./utils")

const utils = serverRequire('@screeps/backend/lib/utils.js')

module.exports = function (config, sandbox) {
	const storage = config.common.storage
	sandbox.map.createPortal = utils.withHelp([
		"createPortal(srcRoom, dstRoom, [opts]) - Create a portal between two rooms (or positions). 'opts' is an object with the following optional properties:\n" +
		"    * decayTime - number of ticks until the portal decays and disappears\n" +
		"    * unstableDate - a timestamp of when the portal should start decaying\n" +
		"    * oneWay - create only one portal from source to dest\n" +
		"    * core - create an 8x8 around a constructed wall for the portals (the wall being the portal's positions)",
		function (srcRoom, dstRoom, opts) {
			opts = opts || {};

			if (opts.decayTime && opts.unstableDate) {
				return q.reject("can't specify both decayTime and unstableDate");
			}

			let srcPos = getPos(srcRoom);
			if (srcPos && !isRoomName(srcRoom)) {
				return q.reject(`Invalid source room "${srcRoom}"`)
			}

			let dstPos = getPos(dstRoom);
			if (dstPos && !isRoomName(dstRoom)) {
				return q.reject(`Invalid destination room "${dstRoom}"`)
			}

			function pickRandomLocation(room, terrainData) {
				const { terrain } = terrainData;
				return { x: 25, y: 25, room: room }
			}

			return storage.db['rooms'].findOne({ _id: srcRoom })
				.then(data => !data ? q.reject('Source room does not exist') : undefined)
				.then(() => {
					return q.all([
						storage.db['rooms.terrain'].findOne({ room: srcRoom }),
						storage.db['rooms.terrain'].findOne({ room: dstRoom })
					])
				})
				.then(([srcTerrain, dstTerrain]) => {
					if (!srcPos) {
						srcPos = pickRandomLocation(srcRoom, srcTerrain);
					}
					if (!dstPos) {
						dstPos = pickRandomLocation(dstRoom, dstTerrain);
					}
				})
				.then(() => "OK")
		}
	]);

	// Regenerate the help message to show our new commands
	sandbox.map._help = utils.generateCliHelp('map.', sandbox.map);
}
