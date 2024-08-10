const _ = require("lodash");
const path = require('path')

const serverModulesDir = path.resolve(process.cwd(), 'node_modules')

function serverRequire(id) {
	return require(require.resolve(id, { paths: [serverModulesDir] }))
}

function isRoomName(roomName) {
	return typeof roomName === "string" && /^[WE]\d+[NS]\d+$/.test(roomName);
}

function getPos(obj) {
	if (!(_.isObject() && !_.isArray(obj) && !_.isFunction(obj) && !_.isRegExp(obj))
		|| typeof obj.room !== "string"
		|| !isRoomName(obj.room)
		|| !_.isFinite(obj.x) || obj.x < 0 || obj.x > 49
		|| !_.isFinite(obj.y) || obj.y < 0 || obj.y > 49) {
		return null;
	}
	return { room: obj.room, x: obj.x, y: obj.y };
}

module.exports = {
	getPos,
	isRoomName,
	serverRequire,
}
