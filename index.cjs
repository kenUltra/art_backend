require("dotenv").config();

const port = process.env.PORT || 4500;
const mongoose = require("mongoose");
const connectMongo = require("./utils/mongo.cjs");
const { server } = require("./configs/server.cjs");

connectMongo();

mongoose.connection.once("open", () => {
	console.log("Successfuly connected to mongodb");
	server.listen(port, () => {
		console.log(`Art server is running on port ${port}`);
	});
});
