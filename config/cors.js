const cors = require("cors");

const corsConfig = {
	methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
	allowedHeaders: [
		"Content-Type",
		"Authorization",
		"Origin",
		"X-Requested-With",
		"Accept",
		"X-Access-Token",
	],
	credentials: true,
	optionsSuccessStatus: 204,
};

module.exports = cors(corsConfig);