const jwt = require("jsonwebtoken");

const createAcessToken = (user) => {
	const acessToken = jwt.sign(
		{
			userInfo: {
				id: user._id,
				userName: user.userName,
				roles: user.credential,
			},
		},
		process.env.ACCESS_TOKEN,
		{ expiresIn: "15m" }
	);
	return acessToken;
};

module.exports = { createAcessToken };
