const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const message = new Schema(
	{
		user: {
			type: Schema.Types.ObjectId,
			ref: "users",
			index: true,
			required: [true, "The owner of the message is required"],
		},
		message: {
			type: String,
			required: true,
			min: 4,
			max: 750,
		},
		userName: {
			type: String,
			required: [true, "The user name is required"],
		},
		firstName: {
			type: String,
			required: true,
		},
		lastName: {
			type: String,
			required: true,
		},
		isPublic: {
			type: Boolean,
			default: true,
		},
		comments: [
			{
				type: Schema.Types.ObjectId,
				ref: "Comment",
			},
		],
		likes: {
			type: Map,
			of: Boolean,
		},
	},
	{ timestamps: true }
);

module.exports = mongoose.model("Message", message);
