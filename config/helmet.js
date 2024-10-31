const helmet = require("helmet");

const helmetConfig = helmet({
	contentSecurityPolicy: {
		directives: {
			defaultSrc: ["'self'"],
			baseUri: ["'self'"],
			blockAllMixedContent: [],
			fontSrc: ["'self'", "https:", "data:"],
			frameAncestors: ["'self'"],
			imgSrc: ["'self'", "data:"],
			objectSrc: ["'none'"],
			scriptSrc: ["'self'"],
			upgradeInsecureRequests: [],
		},
	},
	dnsPrefetchControl: false,
	expectCt: {
		maxAge: 0,
		enforce: true,
	},
	frameguard: {
		action: "deny",
	},
	hidePoweredBy: true,
	hsts: {
		maxAge: 15552000, // 180 days
		includeSubDomains: true,
		preload: true,
	},
	ieNoOpen: true,
	noSniff: true,
	permittedCrossDomainPolicies: {
		permittedPolicies: "none",
	},
	referrerPolicy: {
		policy: "no-referrer",
	},
	xssFilter: true,
});

module.exports = helmetConfig;