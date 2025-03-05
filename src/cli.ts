import _ from "lodash";
import { type CreatePortalOpts } from './types';
import { checkTerrain, decodeTerrain, isRoomName, isRoomPosition, serverRequire } from './utils';

import type utilsMod from '@screeps/backend/lib/utils.js';
import type commonMod from '@screeps/common';

const utils = serverRequire('@screeps/backend/lib/utils.js') as typeof utilsMod;
const common = serverRequire('@screeps/common') as typeof commonMod;
// const engineUtils = serverRequire('@screeps/engine/src/utils.js');

export default function (config: ServerConfig, sandbox: CliSandbox) {
	const storage = config.common.storage;
	const C = config.common.constants;

	async function isValidPortalLocation(roomName: RoomName, x: number, y: number, core: boolean) {
		const objects = (await storage.db['rooms.objects'].find({ room: roomName })) as RoomObject[];
		const terrain = (await storage.db['rooms.terrain'].findOne({
			room: roomName,
		})) as RoomTerrain;

		const checkCoord = (x: number, y: number) => {
			if (!common.checkTerrain(terrain.terrain, x, y, C.TERRAIN_MASK_WALL)) {
				return false;
			}
			if (objects.some((obj) => !C.OBSTACLE_OBJECT_TYPES.concat(['rampart', 'portal']).includes(obj.type))) {
				return false;
			}
			return true;
		};

		if (core) {
			for (let xx = -1; xx < 1; xx++) {
				for (let yy = -1; yy < 1; yy++) {
					if (!checkCoord(x + xx, y + yy)) {
						return false;
					}
				}
			}
		} else {
			if (!checkCoord(x, y)) {
				return false;
			}
		}

		return true;
	}

	// function pickRandomLocation(room: RoomName, terrainData: RoomTerrain, core = false): RoomPosition {
	// 	const { terrain } = terrainData;
	// 	console.log(`pickRandomLocation: ${room}, ${terrain}`);

	// 	const decodedTerrain = decodeTerrain(terrain);

	// 	/** @type {RoomPosition[]} */
	// 	const positions = [];
	// 	for (let x = 0; x <= 49; x++) {
	// 		for (let y = 0; y <= 49; y++) {
	// 			try {
	// 				if (isValidPortalLocation(decodedTerrain, {}, x, y, core)) {
	// 					positions.push({ room, x, y });
	// 				}
	// 			} catch (e) {
	// 				console.error(`Failed to check portal location ${room}, ${x}, ${y}: ${e}`);
	// 			}
	// 		}
	// 	}
	// 	return _.sample(positions);
	// }

	sandbox.map.createPortal = utils.withHelp([
		"createPortal(srcRoom, dstRoom, [opts]) - Create a portal between two rooms (or positions). 'opts' is an object with the following optional properties:\n" +
			'    * decayTime - number of ticks until the portal decays and disappears\n' +
			'    * unstableDate - a timestamp of when the portal should start decaying\n' +
			'    * oneWay - create only one portal from source to dest\n' +
			'    * core - create an 3x3 rings of portals around a constructed wall (the position is in the center)',
		async function (
			_srcRoom: string | RoomPosition,
			_dstRoom: string | RoomPosition,
			_opts: Partial<CreatePortalOpts>
		) {
			const opts = _.defaults<CreatePortalOpts>({}, _opts, {
				decayTime: undefined,
				unstableDate: undefined,
				oneWay: false,
				core: false,
			});

			let makePortalOpts: MakePortalOpts = {};
			if (opts.decayTime && opts.unstableDate) {
				throw new Error("can't specify both decayTime and unstableDate");
			} else if (opts.decayTime) {
				makePortalOpts.decayTime = opts.decayTime;
			} else if (opts.unstableDate) {
				makePortalOpts.unstableDate = opts.unstableDate;
			}

			let srcRoom: string;
			let srcPos: RoomPosition | undefined;
			if (!isRoomPosition(_srcRoom)) {
				if (!isRoomName(_srcRoom)) {
					throw new Error(`Invalid source room "${_srcRoom}"`);
				}
				srcRoom = _srcRoom;
			} else {
				srcPos = _srcRoom;
				srcRoom = srcPos.room;
			}

			let dstRoom: string;
			let dstPos: RoomPosition | undefined;
			if (!isRoomPosition(_dstRoom)) {
				if (!isRoomName(_dstRoom)) {
					throw new Error(`Invalid destination room "${_dstRoom}"`);
				}
				dstRoom = _dstRoom;
			} else {
				dstPos = _dstRoom;
				dstRoom = dstPos.room;
			}

			const srcTerrain = (await storage.db['rooms.terrain'].findOne({
				room: _srcRoom,
			})) as RoomTerrain;
			const dstTerrain = (await storage.db['rooms.terrain'].findOne({
				room: _dstRoom,
			})) as RoomTerrain;

			if (!srcTerrain) {
				throw new Error('Source room does not exist');
			}
			if (!dstTerrain) {
				throw new Error('Destination room does not exist');
			}
			utils.findFreePos(srcRoom, opts.core ? 1 : 0);

			if (!srcPos) {
				srcPos = await utils.findFreePos(srcRoom, opts.core ? 1 : 0);
			} else if (!isValidPortalLocation(srcPos.room, srcPos.x, srcPos.y, opts.core)) {
				throw new Error(`source position ${srcPos} is invalid for a portal`);
			}
			if (!dstPos) {
				dstPos = await utils.findFreePos(dstRoom, opts.core ? 1 : 0);
			} else if (!isValidPortalLocation(dstPos.room, dstPos.x, dstPos.y, opts.core)) {
				throw new Error(`destination position ${dstPos} is invalid for a portal`);
			}
			config.portal.makePortal(srcPos, dstPos, makePortalOpts);
		},
	]);

	// Regenerate the help message to show our new commands
	sandbox.map._help = utils.generateCliHelp('map.', sandbox.map);
}
