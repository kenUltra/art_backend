const checkRoles = (...typesOfRoles) => {
	return (req, res, next) => {
		const userRoles = [...typesOfRoles].map((res) => {
			return Number(res);
		});
		if (!req?.roles) {
			return res.status(401).json({message: "Required role"});
		}
		const roleurl = Object.values(req?.roles);
		const result = roleurl.map((role) => userRoles.includes(role)).find((value) => value === true);

		if (!result) {
			return res.status(401).json({ message: "Your current status doesn't allow this action" });
		}
		next();
	};
};

module.exports = checkRoles;
