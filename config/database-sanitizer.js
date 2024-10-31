const isInvalidMongoDBPayload = (payload) => {
	return typeof payload === "object" && payload !== null && "$" in payload;
};

const databaseSanitizer = (req, res, next) => {
	["query", "body", "params"].forEach((location) => {
		for (let prop in req[location]) {
			if (isInvalidMongoDBPayload(req[location][prop])) {
				delete req[location][prop];
			}
		}
	});

	next();
};

module.exports = databaseSanitizer;