import backend from './backend';
import common from './common';
import engine from './engine';

export default function (config: ServerConfig) {
	common(config);
	if (config.backend) backend(config);
	if (config.engine) engine(config);
}
