const mongo = require("mongoose");
const schema = mongo.Schema;

const spending = new schema(
	{
		name: {
			type: String,
			required: true,
		},
		price: {
			type: Number,
			required: true,
		},
		owner: {
			type: schema.Types.ObjectId,
			ref: "users",
            requied: true,
		},
	},
	{ timestamps: true }
);

module.exports = mongo.model("Spending", spending);
