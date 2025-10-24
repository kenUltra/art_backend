const mongoose = require("mongoose");
const RefreshSchema = mongoose.Schema;

const tokenSchema = new RefreshSchema({
	token: {
		type: String,
		required: true,
	},
	userId: {
		type: RefreshSchema.Types.ObjectId,
		ref: "users",
		required: true,
	},
	expiryDate: {
		type: Date,
		required: true,
	},
});

module.exports = mongoose.model("refreshToken", tokenSchema);
