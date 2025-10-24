const PasswordCheker = require("../utils/pwd.cjs");
const { createAcessToken } = require("../utils/acessToken.cjs");
const { createRefreshToken } = require("../utils/refreshToken.cjs");
const userModel = require("../model/user.cjs");
const tokenModel = require("../model/token.cjs");

const loging = async (req, res) => {
	const { email, password } = req.body;
	if (!email || !password) return res.status(400).json({ message: "Both email and password are required to continue" });
	try {
		const userFounded = await userModel.findOne({ email: email });

		if (!userFounded) return res.status(400).json({ message: "Not allowed data", error: "The email: " + email + " is not founded" });

		const pwd = new PasswordCheker(userFounded.password);
		const passwordMatch = await pwd.comparePassKey(password);

		if (passwordMatch == false) return res.status(400).json({ message: "The password doesn't match", error: "The password that you enter is wrong" });

		const accessToken = createAcessToken(userFounded);
		const refreshToken = createRefreshToken(userFounded);

		const expiryDates = new Date();
		expiryDates.setDate(expiryDates.getDate() + 1);

		await tokenModel.create({
			token: refreshToken,
			userId: userFounded._id,
			expiryDate: expiryDates,
		});
		const userAccessKey = await tokenModel.findOne({ userId: userFounded._id });

		userFounded.updateOne({ $set: { token: userAccessKey._id } });
		userFounded.save();

		res.cookie("token", refreshToken, { httpOnly: true, sameSite: "None", secure: true, maxAge: 24 * 60 * 60 * 1000 });

		res.status(200).json({ access: accessToken, user: userFounded._id });
	} catch (error) {
		res.status(500).json({ message: "Error at: ", error: error.message });
	}
};

const logout = async (req, res) => {
	const cookies = req.cookies;
	if (!cookies?.token) return res.status(204).json({ message: "No accont is loged" });
	try {
		const refreshTokenCookies = cookies.token;
		const searchToken = await tokenModel.findOne({ token: refreshTokenCookies }).lean().populate("userId");

		if (!searchToken) {
			res.clearCookie("token", { httpOnly: true, secure: true });
			return res.status(204).json({ messsage: "the token wasn't founded" });
		}
		await userModel.updateOne({ _id: searchToken.userId._id }, { $set: { token: null } });
		await tokenModel.deleteMany({ userId: searchToken.userId });
		res.clearCookie("token", { httpOnly: true, secure: true });
		res.status(204).json({ message: "See you next time!" });
	} catch (error) {
		res.status(500).json({ message: "Intermal server error", err: error.message });
	}
};

module.exports = { loging, logout };
