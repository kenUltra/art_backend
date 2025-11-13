const workModel = require("../model/employee.cjs");
const spendModel = require("../model/spending.cjs");

const addSpending = async (req, res) => {
	const { nameItem, itemPrice } = req.body;
	const userId = req.params.uuid;
	if (!userId) return res.status(401).json({ messsage: "Fail to process without reference" });
	try {
		const searchuser = await workModel.findOne({ user: userId });
		if (!searchuser) return res.status(403).json({ message: "We can't process." });
		await spendModel.create({
			name: nameItem,
			price: itemPrice,
			owner: searchuser.id,
		});
		res.status(200).json({
			message: "Your expence has been added",
		});
	} catch (err) {
		res.status(500).json({ message: "Something went woung", error: err.message });
	}
};
const getSpendings = async (req, res) => {
	const userid = req.params.uuid;
	if (!userid) return res.status(403).json({ messsage: "Something went is missing without that thing we are not able to continue" });
	try {
		const getWorks = await spendModel.find({ owner: userid });
		if (!getWorks) return res.status(406).json({ message: "Nothing is returned", expences: getWorks });
		res.status(200).json({ message: "Here are all of your spending", expences: getWorks });
	} catch (err) {
		res.status.json({ message: "Cant process", error: err.message });
	}
};
const deleteSpend = async (req, res) => {
	const userId = req.params.uuid;
	const { spendingId } = req.body;
	if (!userId) return res.status(403).json({ message: "The process has been blocked cause something is missing" });
	try {
		const findUser = await spendModel.findOne({ owner: userId });
		if (!findUser) res.status(403).json({ message: "Can't process without the right value" });
		await findUser.deleteOne({ _id: spendingId });
		await findUser.save();
		res.status(200).json({ message: "Expence delete without any issues" });
	} catch (err) {
		res.status(500).json({ message: "Internal error happen", error: err });
	}
};

module.exports = { getSpendings, deleteSpend, addSpending };
