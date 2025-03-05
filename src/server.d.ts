declare var _: import('lodash').LoDashStatic;
declare var q: typeof import('q');

type EventEmitter = import('events').EventEmitter;

interface User {
	_id: string;
	// TODO: incomplete
}

type RoomName = string;

interface RoomPosition {
	room: RoomName;
	x: number;
	y: number;
}

interface RoomTerrain {
	_id: string;
	room: RoomName;
	terrain: string;
}

interface RoomObject {
	x: number;
	y: number;
	type: string;
}

type Cronjob = [number, () => void];

interface ServerConfig {
	backend: {
		features?: Array<{ name: string; version: number }>;
		router: {
			get: (path: string, handler: (request: any, response: any) => void) => void;
		} & EventEmitter;
	};
	common: {
		constants: Record<string, any>;
		storage: {
			db: any;
			env: {
				keys: Record<string, string>;
			};
			pubsub: any;
		};
	};
	engine: EventEmitter;
	cli: {} & EventEmitter;
	cronjobs: Record<string, Cronjob>;
}

interface CommonCli {
	_help: string;
}

interface MapCli extends CommonCli {
	generateRoom: any;
	openRoom: any;
	closeRoom: any;
	removeRoom: any;
	updateRoomImageAssets: any;
	updateTerrainData: any;
}

interface CliSandbox {
	print: (...args: any[]) => void;
	storage: {};
	map: MapCli;
	bots: {};
	strongholds: {};
	system: {};
}

declare module '@screeps/backend/lib/utils.js' {
	export function roomNameFromXY(x: number, y: number): string;
	export function roomNameToXY(name: string): [number, number];
	export function translateModulesFromDb(modules: object): any;
	export function translateModulesToDb(modules: object): any;
	export function getUserWorldStatus(user: User): any;
	export function respawnUser(userId: string): Promise<void>;
	export function withHelp<T extends (...args: any[]) => void>(spec: [desc: string, fn: T]): T;
	export function generateCliHelp(prefix: string, obj: object): string;
	export function writePng(colors: any, width: number, height: number, filename: string): any;
	export function createTerrainColorsMap(terrain: any, zoomIn: any): {};
	export function writeTerrainToPng(terrain: any, filename: any, zoomIn: any): any;
	export function loadBot(name: string): any;
	export function reloadBotUsers(name: string): any;
	export function isBus(coord: number): boolean;
	export function isCenter(x: number, y: number): boolean;
	export function isVeryCenter(x: number, y: number): boolean;
	export function activateRoom(room: RoomName): any;
	export function getActiveRooms(): any;
	export function findFreePos(
		roomName: RoomName,
		distance: number,
		rect?: { x1: number; x2: number; y1: number; y2: number },
		exclude?: { x: number; y: number }
	): Promise<RoomPosition>;
}

declare module '@screeps/common' {
	// export const configManager: typeof import('lib/config-manager');
	// export const storage: typeof import('lib/storage');
	// export const rpc: typeof import('lib/rpc');
	export function findPort(port: any): any;
	export function encodeTerrain(terrain: any): string;
	export function decodeTerrain(
		str: any,
		room: any
	): {
		room: any;
		x: number;
		y: number;
		type: string;
	}[];
	export function checkTerrain(terrain: Uint8Array | string, x: number, y: number, mask: any): boolean;
	export function getGametime(): any;
	export function getDiff(oldData: any, newData: any): {};
	export function qSequence(collection: any, fn: any): any;
	export function roomNameToXY(name: any): any[];
	export function getRoomNameFromXY(x: any, y: any): string;
	export function calcWorldSize(rooms: any): number;
}
