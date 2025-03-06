type CreatePortalOpts = import('./types').CreatePortalOpts;

type PortalOpts =
	| { unstableDate?: number; decayTime?: undefined }
	| { unstableDate?: undefined; decayTime?: boolean | number };

interface ServerConfig {
	portal: {
		createPortalPair(
			src: string | RoomPosition,
			dst: string | RoomPosition,
			_opts: Partial<CreatePortalOpts>
		): void;
		makePortal(pos: RoomPosition, destPos: RoomPosition, opts?: PortalOpts): void;
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
