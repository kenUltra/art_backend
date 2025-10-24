const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const user = new Schema(
	{
		firstName: {
			type: String,
			required: true,
			trim: true,
			minLength: 2,
			maxLength: 40,
		},
		lastName: {
			type: String,
			required: true,
			minLength: 2,
		},
		userName: {
			type: String,
			trim: true,
			unique: true,
			required: true,
			minLength: 3,
		},
		age: {
			type: Number,
			min: 21,
			max: 90,
			required: true,
		},
		gender: {
			type: String,
			enum: ["Male", "Female"],
			required: true,
		},
		email: {
			type: String,
			required: [true, "Email is required"],
			unique: true,
			trim: true,
			lowercase: true,
			match: [/\S+@\S+\.\S+/, "Use only Valid email"],
		},
		password: {
			type: String,
			trim: true,
			required: [true, "The password is required"],
			minLength: 8,
		},
		employeeStatus: {
			type: Schema.Types.ObjectId,
			ref: "Employee",
			index: true,
		},
		credential: {
			User: {
				type: Number,
				default: 2019,
			},
			Manager: Number,
			Executive: Number,
			Beta: Number,
		},
		post: [
			{
				type: Schema.Types.ObjectId,
				ref: "Message",
			},
		],
		token: {
			type: Schema.Types.ObjectId,
			ref: "refreshToken",
			index: true,
		},
	},
	{ timeseries: true }
);

module.exports = mongoose.model("users", user);
