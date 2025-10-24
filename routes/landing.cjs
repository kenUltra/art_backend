const express = require("express");
const path = require("path");

const homePage = express.Router();

homePage.get("^/$|/index(.html)?", (req, res) => {
	res.status(200);
	res.set({
		"Content-Type": "text/html",
	});
	res.sendFile(path.join(__dirname, "..", "public", "views", "index.html"));
});

module.exports = { homePage };
