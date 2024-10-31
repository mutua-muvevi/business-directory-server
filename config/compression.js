const compression = require("compression");

const compressionConfig = {
	filter: (req, res) => {
		if (req.headers["x-no-compression"]) {
			return false;
		}
		return compression.filter(req, res);
	},
	level: 6,
	threshold: 1024,
	windowBits: 15,
	memLevel: 8,
	strategy: compression.Z_DEFAULT_STRATEGY
};

module.exports = compression(compressionConfig);