const mongoose = require("mongoose");
const schema = mongoose.Schema;

const employee = new schema(
	{
		position: {
			type: String,
			required: true,
			// enum: ["Intern", "Vice President", "Senior Vice president", "CEO", "CFO", "Manager", "Execitive", "Employee", "Other"],
			default: "Employee",
		},
		phoneNumber: {
			type: String,
			required: [true, "Make sure to user correct phone number"],
		},	
		interset: {
			type: Array,
			default: [],
		},
		hiredDate: {
			type: Date,
			required: true,
			validate: {
				validator: (value) => value <= new Date(),
				message: "Don't enter a futur date",
			},
		},
		salary: {
			type: String,
			requied: true,
			minLenght: 1500,
		},
		currency: {
			type: String,
			required: [true, "You need to provide the currency that is suited to you"],
			emun: ["USD", "EUR", "GDP"],
		},
		companyName: {
			type: String,
			required: true,
		},
		headQuarter: {
			type: String,
			required: true,
		},
		wesite: {
			type: String,
			required: true,
		},
		coworker: [
			{
				type: schema.Types.ObjectId,
				ref: "users",
				index: true,
			},
		],
		user: {
			type: schema.Types.ObjectId,
			ref: "users",
			index: true,
			required: true,
		},
	},
	{ timestamps: true }
);

module.exports = mongoose.model("Employee", employee);
