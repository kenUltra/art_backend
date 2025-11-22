const jwt = require("jsonwebtoken");
const tokenModel = require("../model/token.cjs");
const userModel = require("../model/user.cjs");
const { createAcessToken } = require("../utils/acessToken.cjs");

const handleRefreshToken = async (req, res) => {
	const cookie = req.cookies;

	if (!cookie?.token) {
		return res.status(401).json({ message: "Can't process" });
	}
	try {
		const userToken = cookie.token;

		const searchToken = await tokenModel.findOne({ token: userToken });

		if (!searchToken) return res.status(403).json({ message: "No access available" });

		const userData = await userModel.findOne({ _id: searchToken.userId }, { _id: 1, credential: 1, userName: 1 });

		jwt.verify(searchToken.token, process.env.REFRESS_TOKEN, (err, decoded) => {
			const user = decoded.userInfo;

			if (err || userData.userName !== user.userName) {
				return res.status(403).json({ message: "The content is blocked" });
			}

			const access = createAcessToken(userData);

			res.status(200).json({ access });
		});
	} catch (err) {
		res.status(500).json({ message: "The server has some issues", error: err.message });
	}
};
module.exports = { handleRefreshToken };
