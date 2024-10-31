const sanitizeString = (str) => {
	return str
		.replace(/&/g, "&amp;")
		.replace(/</g, "&lt;")
		.replace(/>/g, "&gt;");
};

const expressSanitizer = (req, res, next) => {
	["query", "body", "params"].forEach((location) => {
		for (let prop in req[location]) {
			if (typeof req[location][prop] === "string") {
				req[location][prop] = sanitizeString(req[location][prop]);
			}
		}
	});

	next();
};

module.exports = expressSanitizer;