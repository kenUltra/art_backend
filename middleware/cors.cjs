const { allowedSite } = require("../utils/allowedHost.cjs");

const corsOption = {
	origin: (origin, callback) => {
		if (allowedSite.indexOf(origin) !== -1 || !origin) {
			callback(null, true);
		} else {
			callback(new Error("The site that you try to includes is not allowed"));
		}
	},
	optionsSuccessStatus: 200,
};

module.exports = corsOption;
