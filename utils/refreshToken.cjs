const jwt = require("jsonwebtoken");

const createRefreshToken = (user) => {
	const refreshToken = jwt.sign(
		{
			userInfo: {
				id: user._id,
				userName: user.userName,
				roles: user.credential,
			},
		},
		process.env.REFRESS_TOKEN,
		{ expiresIn: "2d" }
	);
	return refreshToken;
};

module.exports = { createRefreshToken };
