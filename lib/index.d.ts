type RoomName = string

interface RoomPosition {
	room: RoomName
	x: number
	y: number
}

interface RoomTerrain {
	_id: string
	room: RoomName
	terrain: string
}

type CreatePortalOpts = (
	| {
			decayTime: number
	  }
	| {
			unstableDate: number
	  }
) & {
	oneWay: boolean
	core: boolean
}
