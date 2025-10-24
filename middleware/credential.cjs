const { allowedSite } = require("../utils/allowedHost.cjs");

const credential = (req, res, next) => {
	const origin = req.headers.origin;
	if (allowedSite.includes(origin)) {
		res.header("Access-Control-Allow-Credentials", true);
	}
	next();
};

module.exports = { credential };
