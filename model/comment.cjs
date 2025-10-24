const mongo = require("mongoose");
const Schema = mongo.Schema;

const comment = new Schema(
	{
		message: {
			type: String,
			required: [true, "Your conset is need"],
		},
		sender: {
			type: String,
			required: true,
		},
		likes: {
			type: Map,
			of: Boolean,
		},
		postToComment: {
			type: Schema.Types.ObjectId,
			ref: "message",
		},
	},
	{ timestamps: true }
);

module.exports = mongo.model("Comment", comment);
