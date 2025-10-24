const userModel = require("../model/user.cjs");
const tokenModel = require("../model/token.cjs");

const logoutController = async (req, res) => {
	const cookies = req.cookies;
	if (!cookies?.token) {
		return res.status(201).json({ message: "no content avaialable" });
	}
	try {
		const tokenCookies = cookies.token;
		const searchUser = await userModel.findOne({ tokenCookies }).exec();
		if (!searchUser) {
			res.clearCookie("token", { httpOnly: true, sameSite: "None", secure: true });
			return res.sendStatus(204);
		}
		searchUser.token = "";

		const result = await searchUser.save();
		await tokenModel.deleteOne({ token: tokenCookies });

		res.clearCookie("token", { httpOnly: true, sameSite: "None", secure: true });

		res.status(204).json({ message: "Logout without any issues: ", content: result });
	} catch (error) {
		res.status(500).json({ message: "Error happpen" });
	}
};

module.exports = { logoutController };
