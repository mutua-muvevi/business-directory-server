const useragent = require("express-useragent");
const geoip = require("geoip-lite");
const logger = require("../utils/logger");

const requestMiddleware = (req, res, next) => {
	try {
		// 1. Parsing user-agent
		const source = req.headers["user-agent"];
		const agent = useragent.parse(source);

		req.userDetails = {
			browser: agent.browser,
			os: agent.os,
			platform: agent.platform,
			isMobile: agent.isMobile,
			isTablet: agent.isTablet,
			isDesktop: agent.isDesktop,
		};

		// 2. Extracting IP address (handling cases with multiple proxies)
		const ip =
			(req.headers["x-forwarded-for"] || "").split(",").pop().trim() ||
			req.connection.remoteAddress ||
			req.socket.remoteAddress ||
			req.connection.socket.remoteAddress;

		logger.info(`IP address: ${ip}`);

		// 3. Getting geolocation data
		const geo = geoip.lookup(ip);
		if (geo) {
			req.userDetails.location = {
				country: geo.country,
				region: geo.region,
				city: geo.city,
			};
		}

		logger.info(`GEO data: ${geo}`);

		// 4. Continuing the request processing
		next();

	} catch (error) {
		logger.error(`Error in requestMiddleware: ${JSON.stringify(error)}`);
		next(error);
	}
};
