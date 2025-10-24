const jwt = require("jsonwebtoken");

const verifyJWT = (req, res, next) => {
	const authHead = req.headers.authentication || req.headers.Authentication;
	if (!authHead?.startsWith("Bearer ")) return res.sendStatus(401);
	const token = authHead.split(" ")[1];
	jwt.verify(token, process.env.ACCESS_TOKEN, (err, decoded) => {
		if (err) return res.status(403).json({ message: "Error", error: err });
		req.user = decoded.userInfo.userName;
		req.roles = decoded.userInfo.roles;
		next();
	});
};

module.exports = { verifyJWT };
