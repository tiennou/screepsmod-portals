export type CreatePortalOpts = {
	oneWay?: boolean;
	core?: boolean;
} & ({ unstableDate?: number; decayTime?: undefined } | { unstableDate?: undefined; decayTime?: number | boolean });

export type PortalOpts =
	| { unstableDate?: number; decayTime?: undefined }
	| { unstableDate?: undefined; decayTime?: boolean | number };

export interface PortalModSettings {
	/**
	 * How many portal pairs to maintain on the map.
	 */
	maxPairs: number;
	/**
	 * How close/far apart can a portal pair be.
	 *
	 * First number is the minimum distance; can be `0` to make portals as close as possible.
	 * Second number is the maximum distance; can be `Infinity` to make portals as far as possible.
	 */
	distance: [number, number];
	/**
	 * Randomness thresholds for various settings.
	 * All those numbers are floats in [0, 1].
	 * Not specifying a number means the chance is effectively 0.
	 */
	chance: {
		/** Random chance that a portal is decaying. */
		decay: number;
		/** Random chance that a portal is unstable. */
		unstable: number;
		/**
		 * Random chance that a portal won't obey the normal rules.
		 *
		 * A stray portal might spawn outside of the core/crossroads rooms.
		 *
		 * @todo Unimplemented
		 */
		stray: number;
		/**
		 * Random chance that a portal is a one-way.
		 *
		 * A one way portal won't have a reverse portal linking back to where it came from.
		 *
		 * @todo Unimplemented
		 */
		oneWay: number;
	};
	decayTimeRange: number | [number, number];
	unstableDateRange: number | [number, number];
}

declare global {
	interface ServerConfig {
		portal: {
			settings: PortalModSettings;
			loadSettings(data: any): void;
			createPortalPair(
				src: string | RoomPosition,
				dst: string | RoomPosition,
				_opts?: Partial<CreatePortalOpts>
			): void;
			makePortal(pos: RoomPosition, destPos: RoomPosition, opts?: PortalOpts): void;
		};
	}

	interface MapCli {
		createPortal(
			_srcRoom: string | RoomPosition,
			_dstRoom: string | RoomPosition,
			_opts: Partial<CreatePortalOpts>
		): Promise<void>;
		removePortal(src: string, dst?: string): Promise<string>;
	}
}
