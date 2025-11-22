const userModel = require("../model/user.cjs");
const tokenDB = require("../model/token.cjs");
const UserData = require("../utils/pwd.cjs");

const { createAcessToken } = require("../utils/acessToken.cjs");
const { createRefreshToken } = require("../utils/refreshToken.cjs");
const { symbols, nameToUppercase } = require("../utils/symbol.cjs");

const getUsers = async (req, res) => {
	try {
		const users = await userModel.find();
		if (users.length == 0) return res.status(201).json({ messsage: "no users available", user: users, statusCode: 201 });

		res.status(200).json(users);
	} catch (error) {
		res.status(500).json({ message: "Something went wrong when getting users", Error: error });
	}
};
const creatUser = async (req, res) => {
	const { firstName, lastName, userName, email, age, gender, password, hostOS, userHardware } = req.body;
	const alias = userName.trim().replaceAll(" ", "_");

	if (!firstName || !lastName || !userName || !email || !password || !age || !gender || !hostOS || !userHardware) {
		return res.status(403).json({ message: "Not allowd to continue", error: "Can't procces until you fill the required data" });
	}
	if (password.length <= 6) {
		return res.status(405).json({ messaage: "The password that you enter is too short,", error: "Please use a longer passsword" });
	}
	try {
		let blockAction = true;
		const passwordData = new UserData(password.trim());
		const valueHashed = passwordData.hashPassword();
		const isEmailTaken = await userModel.findOne({ email: email.trim() });
		const isUserNameTaken = await userModel.findOne({ userName: "@" + alias });

		for (const symbol of symbols) {
			if (userName.includes(symbol)) {
				blockAction = false;
				break;
			}
			blockAction = true;
		}
		if (!blockAction) {
			return res.status(403).json({ message: "Don't include any symbole in your user name" });
		}

		if (isEmailTaken !== null) return res.status(403).json({ messsage: "Invalid email", error: "This email: " + email + " is already used. Try out another email" });

		if (isUserNameTaken !== null) return res.status(401).json({ message: "Invalid user name", error: "The user name: " + userName + " is taken." });

		await userModel.insertMany({
			firstName: nameToUppercase(firstName.trim()),
			lastName: nameToUppercase(lastName.trim()),
			userName: "@" + alias,
			email: email.trim(),
			password: valueHashed,
			age: age,
			gender: gender,
			userOS: hostOS,
			hostHardware: userHardware,
		});

		const userMade = await userModel.findOne({ email: email });
		if (!userMade) return res.status(401).json({ message: "Some issues happen during the creation of your account" });

		const accessToken = createAcessToken(userMade);
		const refreshToken = createRefreshToken(userMade);
		const expireDate = new Date();

		await userMade.updateOne({ $set: { token: userMade._id } });

		await tokenDB.insertMany({
			token: refreshToken,
			userId: userMade._id,
			expiryDate: expireDate,
		});

		res.cookie("token", refreshToken, { httpOnly: true, sameSite: "None", secure: true, maxAge: 1 * 1 * 2 * 1000 });

		res.status(200).json({ message: "Welcome: " + userMade.userName + " greate to have you with us", access: accessToken, user: userMade._id });
	} catch (error) {
		res.status(500).json({ messsage: "Problem occured in: " + error.message, error: "Internal server error occred" });
	}
};
const updateUserName = async (req, res) => {
	const uuid = req.params.userId;
	const { userName } = req.body;

	if (!uuid) return res.status(401).json({ message: "Something is missing" });
	if (!userName) return res.status(401).json({ message: "No update will happen if you don't provide anything" });
	if (userName.length > 15 || userName.length < 3) return res.status(403).json({ message: "The length of the user name typeed is too long or too short" });
	try {
		const lookingTarget = await userModel.findById(uuid);
		if (!lookingTarget) return res.status(403).json({ message: "Can't process cause error occured" });
		const takenName = await userModel.find({ userName: userName });
		if (takenName.length > 0) return res.status(409).json({ message: userName + " name is already usesd " });
		for (const symbol of symbols) {
			if (userName.includes(symbol)) {
				blockAction = false;
				break;
			}
			blockAction = true;
		}
		const changeSpaceName = "@" + userName.trim().replaceAll(" ", "_");
		if (!blockAction) {
			return res.status(403).json({ message: "Don't include any symbole in your user name" });
		}
		await userModel.updateOne({ $set: { userName: changeSpaceName } });

		res.status(200).json({ message: "Account updated" });
	} catch (error) {
		res.status(500).json({ messsage: "Internal error occured", error: error.message });
	}
};
const deleteUser = async (req, res) => {
	const uuid = req.params.userId;
	if (!uuid) return res.status(405).json({ status: "Failed", content: "Can't do anything" });
	try {
		const userToRemove = await userModel.findById(uuid);
		if (!userToRemove) return res.status(409).json({ status: "Failed", content: "Not allowed to do anything, due to some mistakes" });
		await userModel.deleteOne({ _id: userToRemove._id });

		res.status(201).json({ status: "Success", content: "This account is no loger part of the Art inc, user." });
	} catch (err) {
		res.status(500).json({ status: 500, error: err.message, content: "Internal issues happen" });
	}
};
const getUser = async (req, res) => {
	const uuid = req.params.userId;
	if (!uuid) return res.status(403).json({ messsage: "Forbiden procecess", error: "Make sure to add an idenity before processing" });
	try {
		const targetUser = await userModel.findById(uuid, { password: 0, credential: 0, _id: 0 }).exec();
		if (!targetUser) {
			return res.status(409).json({ message: "No content", error: "The id that you submited is not regiester" });
		}
		res.status(200).json(targetUser);
	} catch (error) {
		res.status(500).json({ message: "Problem occured", error: error.message });
	}
};

module.exports = { getUsers, creatUser, getUser, updateUserName, deleteUser };
