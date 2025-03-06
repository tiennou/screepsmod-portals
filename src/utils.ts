import path from 'path';

const serverModulesDir = path.resolve(process.cwd(), 'node_modules');

export function serverRequire(id: string) {
	return require(require.resolve(id, { paths: [serverModulesDir] }));
}

export function log(...msg: any[]) {
	console.log(`[portals]`, ...msg);
}

export function isRoomName(roomName: unknown): roomName is RoomName {
	return typeof roomName === 'string' && /^[WE]\d+[NS]\d+$/.test(roomName);
}

export function isRoomPosition(obj: unknown): obj is RoomPosition {
	if (
		typeof obj !== 'object' ||
		!obj ||
		!('room' in obj) ||
		typeof obj.room !== 'string' ||
		!isRoomName(obj.room) ||
		!('x' in obj) ||
		typeof obj.x !== 'number' ||
		obj.x < 0 ||
		obj.x > 49 ||
		!('y' in obj) ||
		typeof obj.y !== 'number' ||
		obj.y < 0 ||
		obj.y > 49
	) {
		return false;
	}
	return true;
}

export function printPos(pos: RoomPosition) {
	return JSON.stringify(pos);
}


/**
 *
 * @param {string} terrain
 * @returns
 */
export function decodeTerrain(terrain: string) {
	return terrain.split('').map((char) => Number(char));
}

export function checkTerrain(terrain: number[], x: number, y: number, mask: number) {
	if (x < 0 || x > 49) throw new Error(`x coordinate out of terrain bounds: ${x}`);
	if (y < 0 || y > 49) throw new Error(`y coordinate out of terrain bounds: ${y}`);
	const code = terrain[y * 50 + x];
	return (code & mask) > 0;
}
