const userModel = require("../model/user.cjs");
const workdModel = require("../model/employee.cjs");

const getEmployees = async (req, res) => {
	try {
		const employee = await userModel.find();
		if (!employee) {
			return res.status(201).json({ message: "There is no employee founded" });
		}
		res.status(200).json(employee);
	} catch (error) {
		res.status(500).json({ message: "something went wrong ", error: error });
	}
};
const addEmployee = async (req, res) => {
	const uuid = req.params.uuid;
	const { position, hiredDate, salary, currency, companyName, headQuarter, website, phoneNumber } = req.body;
	if (!uuid) {
		return res.status(403).json({ message: "Without an identity nothing will happen" });
	}
	if (!position || !hiredDate || !salary || !companyName || !currency || !headQuarter || !website || !phoneNumber) {
		return res.status(401).json({ message: "To continue please add all requied information" });
	}
	if (typeof salary !== "number" || salary <= 0) {
		return res.status(401).json({ message: "Do not use a negative number in a salary box" });
	}

	try {
		function changePhone(value) {
			const rmStr = value.replaceAll("_pth_", " ");
			return rmStr;
		}
		const user = await userModel.findById(uuid);
		if (!user) {
			return res.status(404).json({ message: "The user is not founded" });
		}

		await workdModel.insertMany({
			position: position,
			companyName: companyName,
			wesite: website,
			user: user._id,
			hiredDate: hiredDate,
			headQuarter: headQuarter,
			coworker: [],
			salary: salary,
			currency: currency,
			phoneNumber: changePhone(phoneNumber),
		});
		res.status(200).json({ message: "Your work status is active", status: "success" });
	} catch (error) {
		res.status(500).json({ message: "Trouble happen in our server", error: error });
	}
};
const deletEmployee = async (req, res) => {
	const person = req.body.jobRef;
	if (!person) return res.status(403).json({ message: "Not allowed to continue due to missed data" });
	try {
		const findJob = await workdModel.findById(person).populate("users");
		if (!findJob) return res.status(401).json({ message: "The postion is not founded" });

		const findUser = await userModel.findOne(findJob.user._id);
		if (!findUser) return res.status(401).json({ message: "The user is not founded" });

		await findJob.deleteOne();
		findUser.employeeStatus = null;
		await findUser.save();

		res.status(204).json({ message: "The employee data is deleted" });
	} catch (err) {
		res.status(500).json({ message: "Something went wrong in server due to: ", error: err });
	}
};
const getEmployee = async (req, res) => {
	const id = req.params.uuid;
	if (!id) return res.status(403).json({ message: "Must have an id to continue" });
	try {
		const searchPerson = await workdModel.findOne({ user: id });

		if (!searchPerson) return res.status(301).json({ message: "No employee value", employeeDetail: null });
		
		res.status(200).json({ message: "Check out you employee value ", employeeDetail: searchPerson });
	} catch (err) {
		res.status(500).json({ message: "The server is not responding", error: err.message });
	}
};
const updateCo_Employee = async (req, res) => {
	const refId = req.params.uuid;
	const newEm = req.body.coworker;

	if (!refId) return res.status(403).json({ message: "Not allowed to changed anything" });
	if (!newEm) return res.status(401).json({ messge: "You need to provide another user uuid to continue" });
	if (typeof newEm !== "object") return res.status(403).json({ message: "The value is not allowed to be add" });
	try {
		const employeeFounded = await workdModel.findById(refId);
		if (!employeeFounded) res.status(404).json({ message: "The employee uuid is not found" });
		await employeeFounded.updateOne({ $push: { coworker: newEm } });
		res.status(200).json({ message: "You have added " + newEm.lenght + " correctly" });
	} catch (err) {
		res.status(500).json({ message: "Server has an issues", error: err });
	}
};

module.exports = { getEmployees, addEmployee, deletEmployee, getEmployee, updateCo_Employee };
