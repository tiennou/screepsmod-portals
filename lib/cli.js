const q = require("q");
const utils = require('@screeps/backend/lib/utils.js')
const { isRoomName, getPos } = require("./utils");

module.exports = function (config, sandbox) {
	const storage = config.common.storage
	sandbox.map.createPortal = utils.withHelp([
		"createPortal(srcRoom, dstRoom, [opts]) - Create a portal between two rooms (or positions). 'opts' is an object with the following optional properties:\n" +
		"    * decayTime - number of ticks until the portal decays and disappears\n" +
		"    * unstableDate - a timestamp of when the portal should start decaying\n" +
		"    * oneWay - create only one portal from source to dest\n" +
		"    * core - create an 8x8 around a constructed wall for the portals (the wall being the portal's positions)",
		// * exits - an object with exit coordinates arrays, e.g. {top: [20,21,23], right: [], bottom: [27,28,29,40,41]}, default is random\r
		// * terrainType - the type of generated landscape, a number from 1 to 28, default is random\r
		// * swampType - the type of generated swamp configuration, a number from 0 to 14, default is random\r
		// * sources - the amount of sources in the room, default is random from 1 to 2\r
		// * mineral - the type of the mineral deposit in this room or false if no mineral, default is random type\r
		// * controller - whether this room should have the controller, default is true\r
		// * keeperLairs - whether this room should have source keeper lairs, default is false`,
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
