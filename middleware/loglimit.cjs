const { rateLimit } = require("express-rate-limit");

const limit = rateLimit({
	windowMs: 10 * 60 * 1000,
	ipv6Subnet: 56,
	limit: 5,
	standardHeaders: "draft-8",
	legacyHeaders: false,
	message: "Too many requests, please try again later, after 10 minutes.",
});

module.exports = limit;
