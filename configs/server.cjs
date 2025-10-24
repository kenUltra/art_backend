const path = require("node:path");

const cors = require("cors");
const express = require("express");
const cookieParser = require("cookie-parser");
const server = express();

const corsOption = require("../middleware/cors.cjs");
// route ref
const { homePage } = require("../routes/landing.cjs");
const userRoute = require("../routes/user.cjs");
const authRoute = require("../routes/auth.cjs");
const refreshRoute = require("../routes/refresh.cjs");
const messageRoute = require("../routes/message.cjs");
const employeeRoute = require("../routes/employee.cjs");
const commentRoute = require("../routes/comment.cjs");
// middleware
const { errorHandler } = require("../middleware/error.cjs");
const { credential } = require("../middleware/credential.cjs");
const { verifyJWT } = require("../middleware/veriryJWT.cjs");

server.use(credential);

server.use(cors(corsOption));

// used for handling urlencoded data
server.use(express.urlencoded({ extended: false }));

server.use(cookieParser());

server.use(express.json());

server.use("/static", express.static(path.join(__dirname, "..", "/public")));

server.use("/", homePage);
server.use("/api/v1", authRoute);
server.use("/api/v1", refreshRoute);
server.use("/api/v1", userRoute);
server.use("/api/v1", verifyJWT, employeeRoute);
server.use("/api/v1", verifyJWT, messageRoute);
server.use("/api/v1", verifyJWT, commentRoute);

server.all("*", (req, res) => {
	const clientAgent = req.headers["user-agent"];

	res.status(404);

	if (clientAgent.includes("curl")) {
		res.json({ title: "404 not founded", messge: "The path that you are looking at is not found" });
	} else if (req.accepts("text/html")) {
		res.sendFile(path.join(__dirname, "..", "public", "views", "notfound.html"));
	} else if (req.accepts("json")) {
		res.json({ error: "404 not founded", message: "The thing that you try to reach is not founded" });
	} else {
		res.type("txt").send("404 not found");
	}
});

server.use(errorHandler);

module.exports = { server };
