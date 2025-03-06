export interface RoomObject {
	_id?: string;
	x: number;
	y: number;
	room: RoomName;
	type: string;
}

export interface PortalObject extends RoomObject {
	type: 'portal';
	destination: RoomPosition;
	unstableDate?: number;
	decayTime?: number;
}

export interface WallObject extends RoomObject {
	type: 'constructedWall';
	newbieWall?: boolean;
	notifyWhenAttacked?: boolean;
	ticksToLive?: number;
	decayTime?: number | { timestamp: number };
	hits?: number;
	hitsMax?: number;
}
