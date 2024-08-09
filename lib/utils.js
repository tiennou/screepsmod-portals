const _ = require("lodash");

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

function withHelp(array) {
	var fn = array[1];
	fn._help = array[0];
	return fn;
};

function generateCliHelp(prefix, container) {
	return `Available methods:\r\n` + Object.keys(container).filter(i => typeof container[i] == 'function').map(i => ' - ' + prefix + (container[i]._help || i)).join('\r\n');
};

module.exports = {
	generateCliHelp,
	getPos,
	isRoomName,
	withHelp,
}
