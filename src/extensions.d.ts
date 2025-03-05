type CreatePortalOpts = import('./types').CreatePortalOpts;

type MakePortalOpts = { unstableDate?: number; decayTime?: number };

interface ServerConfig {
	portal: {
		makePortal(pos: RoomPosition, destPos: RoomPosition, opts: MakePortalOpts): void;
		settings: Record<string, any>;
	};
}

interface MapCli {
	createPortal(
		_srcRoom: string | RoomPosition,
		_dstRoom: string | RoomPosition,
		_opts: Partial<CreatePortalOpts>
	): void;
}
