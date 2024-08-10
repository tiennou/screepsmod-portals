const _ = require("lodash");
const path = require('path')

const serverModulesDir = path.resolve(process.cwd(), 'node_modules')

function serverRequire(id) {
	return require(require.resolve(id, { paths: [serverModulesDir] }))
}

/**
 * @param {string} roomName
 * @returns {roomName is RoomName}
 */
function isRoomName(roomName) {
	return typeof roomName === "string" && /^[WE]\d+[NS]\d+$/.test(roomName);
}

/**
 *
 * @param {unknown} obj
 * @returns {obj is RoomPosition}
 */
function isRoomPosition(obj) {
	if (typeof obj !== "object" || !obj
		|| !("room" in obj) || typeof obj.room !== "string" || !isRoomName(obj.room)
		|| !("x" in obj) || typeof obj.x !== "number" || obj.x < 0 || obj.x > 49
		|| !("y" in obj) || typeof obj.y !== "number" || obj.y < 0 || obj.y > 49) {
		return false;
	}
	return true;
}

function prettyPrintTerrain(terrain) {

}

/**
 *
 * @param {string} terrain
 * @returns
 */
function decodeTerrain(terrain) {
	return terrain.split("").map(char => Number(char))
}

/**
 *
 * @param {number[]} terrain
 * @param {number} x
 * @param {number} y
 * @param {number} mask
 */
function checkTerrain(terrain, x, y, mask) {
	if (x < 0 || x > 49) throw new Error(`x coordinate out of terrain bounds: ${x}`)
	if (y < 0 || y > 49) throw new Error(`y coordinate out of terrain bounds: ${y}`)
	const code = terrain[y * 50 + x]
	return (code & mask) > 0
}


module.exports = {
	decodeTerrain,
	checkTerrain,
	isRoomPosition,
	isRoomName,
	serverRequire,
}
