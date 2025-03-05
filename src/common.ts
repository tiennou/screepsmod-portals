import path from 'path';
import { isRoomPosition } from './utils';

const DEFAULTS = {
	maxPortalPairs: 10,
};

export default function (config: ServerConfig) {
	const C = config.common.constants;
	const storage = config.common.storage;

	let settings;
	try {
		const configPath = path.resolve(process.cwd(), 'portals.js');
		console.log(`portals: looking for portals.js in ${configPath}`);
		settings = require(configPath).settings;
		console.log('portals: portals.js file found and loaded successfully.');
	} catch (e) {
		console.log('portals: portals.js file not found, reverting to defaults.');
		settings = DEFAULTS;
	}

	config.portal = {
		settings,
		makePortal: function (pos: RoomPosition, destPos: RoomPosition, opts: MakePortalOpts) {
			if (!isRoomPosition(pos) || !isRoomPosition(destPos)) {
				throw new Error('Invalid portal positions!');
			}

			let unstableDate = undefined;
			let decayTime = undefined;
			if (_.isFinite(opts.unstableDate) && opts.unstableDate! > 0) {
				unstableDate = opts.unstableDate;
			} else {
				decayTime = opts.decayTime ?? C.PORTAL_DECAY;
			}

			storage.db['rooms.objects'].insert({
				room: pos.room,
				x: pos.x,
				y: pos.y,
				type: 'portal',
				destination: destPos,
				decayTime,
				unstableTime: unstableDate,
			});
		},
	};
}
