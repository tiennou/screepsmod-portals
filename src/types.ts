export type CreatePortalOpts = {
	oneWay: boolean;
	core: boolean;
} & ({ unstableDate?: number; decayTime?: undefined } | { unstableDate?: undefined; decayTime?: number | boolean });
