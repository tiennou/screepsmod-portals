const _ = require("lodash")
const path = require('path');
const { isRoomPosition } = require("./utils");
// const EventEmitter = require('events').EventEmitter

const DEFAULTS = {
	maxPortalPairs: 10,
}

module.exports = function (config) {
	const C = config.common.constants;
	const storage = config.common.storage
	config.portal = {
		/**
		 *
		 * @param {RoomPosition} pos
		 * @param {RoomPosition} destPos
		 * @param {any} opts
		 */
		makePortal: function (pos, destPos, opts) {
			if (!isRoomPosition(pos) || !isRoomPosition(destPos)) {
				throw new Error("Invalid portal positions!");
			}

			let unstableTime = undefined
			let decayTime = undefined
			if (_.isFinite(opts.unstableTime) && opts.unstableTime > 0) {
				unstableTime = opts.unstableTime
			} else {
				decayTime = opts.decayTime || C.PORTAL_DECAY
			}

			storage.db['rooms.objects'].insert({
				room: pos.room,
				x: pos.x,
				y: pos.y,
				type: 'portal',
				destination: destPos,
				decayTime,
				unstableTime,
			})
		},
	}
	try {
		const configPath = path.resolve(process.cwd(), 'portals.js')
		console.log(`portals: looking for portals.js in ${configPath}`)
		config.market = require(configPath).settings
		console.log('portals: portals.js file found and loaded successfully.')
	} catch (e) {
		console.log('portals: portals.js file not found, reverting to defaults.')
		config.market = DEFAULTS
	}
}
