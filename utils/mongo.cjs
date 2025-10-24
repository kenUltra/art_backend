const mongoose = require("mongoose");

const connectMongo = async () => {
	try {
		await mongoose.connect(process.env.DATABASE_URI, {
			useUnifiedTopology: true,
			useNewUrlParser: true,
		});
	} catch (error) {
		console.error(
			new Error("The process of connecting the the database failed", {
				status: 500,
				message: "Coonection failed",
				cause: error.reason,
			})
		);
	}
};

module.exports = connectMongo;
