const Role_types = {
	User: process.env.USER,
	Manager: process.env.MANAGER,
	Executive: process.env.EXECUTIVE,
	betaUser: process.env.BETA_TESTER,
};

module.exports = { userRoles: Role_types };
