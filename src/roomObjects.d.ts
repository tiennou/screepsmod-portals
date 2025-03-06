type DepositType = 'biomass' | 'metal' | 'mist' | 'silicon';

interface Room {
	_id?: string;
	name: string;
	status: 'normal' | 'out of borders';
	bus: boolean;
	openTime: number;
	sourceKeepers: boolean;
	novice: null;
	respawnArea: null;
	depositType: DepositType;
	nextForceUpdateTime: number;
	powerBankTime: number;
}

interface RoomObject {
	_id?: string;
	x: number;
	y: number;
	room: RoomName;
	type: string;
}

interface PortalObject extends RoomObject {
	type: 'portal';
	destination: RoomPosition;
	unstableDate?: number;
	decayTime?: number;
}

interface WallObject extends RoomObject {
	type: 'constructedWall';
	newbieWall?: boolean;
	notifyWhenAttacked?: boolean;
	ticksToLive?: number;
	decayTime?: number | { timestamp: number };
	hits?: number;
	hitsMax?: number;
}
