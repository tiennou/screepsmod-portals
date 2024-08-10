const _ = require("lodash")
const q = require("q");
const { isRoomName, isRoomPosition, serverRequire, decodeTerrain, checkTerrain } = require("./utils")

const utils = serverRequire('@screeps/backend/lib/utils.js')
const engineUtils = serverRequire('@screeps/engine/src/utils.js')

module.exports = function (config, sandbox) {
	const storage = config.common.storage
	const C = config.common.constants
	sandbox.map.createPortal = utils.withHelp([
		"createPortal(srcRoom, dstRoom, [opts]) - Create a portal between two rooms (or positions). 'opts' is an object with the following optional properties:\n" +
		"    * decayTime - number of ticks until the portal decays and disappears\n" +
		"    * unstableDate - a timestamp of when the portal should start decaying\n" +
		"    * oneWay - create only one portal from source to dest\n" +
		"    * core - create an 3x3 rings of portals around a constructed wall (the position is in the center)",
		/**
		 *
		 * @param {string | RoomPosition} _srcRoom
		 * @param {string | RoomPosition} _dstRoom
		 * @param {Partial<CreatePortalOpts>?} _opts
		 * @returns
		 */
		function (_srcRoom, _dstRoom, _opts) {
			/** @type {CreatePortalOpts} */
			const opts = _.defaults({}, _opts || {}, { decayTime: 0, unstableDate: 0, oneWay: false, core: false })

			if ("decayTime" in opts && "unstableDate" in opts) {
				return q.reject("can't specify both decayTime and unstableDate");
			}

			/** @type {string} */
			let srcRoom
			/** @type {RoomPosition} */
			let srcPos
			if (isRoomPosition(_srcRoom)) {
				srcPos = _srcRoom
			} else {
				if (!isRoomName(_srcRoom)) {
					return q.reject(`Invalid source room "${_srcRoom}"`)
				} else {
					srcRoom = _srcRoom
				}
			}

			/** @type {string} */
			let dstRoom
			/** @type {RoomPosition} */
			let dstPos
			if (isRoomPosition(_dstRoom)) {
				dstPos = _dstRoom
			} else {
				if (!isRoomName(_dstRoom)) {
					return q.reject(`Invalid destination room "${_dstRoom}"`)
				} else {
					dstRoom = _dstRoom
				}
			}

			/**
			 *
			 * @param {string} room
			 * @param {RoomTerrain} terrainData
			 * @param {boolean} core
			 * @returns
			 */
			function pickRandomLocation(room, terrainData, core = false) {
				const { terrain } = terrainData
				console.log(`pickRandomLocation: ${room}, ${terrain}`)

				const decodedTerrain = decodeTerrain(terrain);

				/** @type {RoomPosition[]} */
				const positions = [];
				for (let x = 0; x <= 49; x++) {
					for (let y = 0; y <= 49; y++) {
						let blocked = false;
						if (core) {
							abort: for (let xx = -1; xx < 1; xx++) {
								for (let yy = -1; yy < 1; yy++) {
									if (checkTerrain(decodedTerrain, x + xx, y + yy, C.TERRAIN_MASK_WALL)) {
										blocked = true
										break abort
									}
								}
							}
						} else {
							if (checkTerrain(decodedTerrain, x, y, C.TERRAIN_MASK_WALL)) {
								blocked = true
							}
						}
						if (!blocked) {
							positions.push({ room, x, y })
						}
					}
				}
				return _.sample(positions)
			}

			return q.all([
				storage.db['rooms.terrain'].findOne({ room: _srcRoom }),
				storage.db['rooms.terrain'].findOne({ room: _dstRoom })
			])
				.then(
					/**
					*
					* @param {[RoomTerrain, RoomTerrain]} param0
					* @returns
					*/
					([srcTerrain, dstTerrain]) => {
						if (!srcTerrain) {
							return q.reject('Source room does not exist')
						}
						if (!dstTerrain) {
							return q.reject('Destination room does not exist')
						}
					if (!srcPos) {
						utils.findFreePos(srcRoom, 0,)
						srcPos = pickRandomLocation(srcRoom, srcTerrain, opts.core);
					}
					if (!dstPos) {
						dstPos = pickRandomLocation(dstRoom, dstTerrain, opts.core);
					}
				})
				.then(() => "OK")
				.catch((err) => {
					return q.reject(err);
				})
		}
	]);

	// Regenerate the help message to show our new commands
	sandbox.map._help = utils.generateCliHelp('map.', sandbox.map);
}
