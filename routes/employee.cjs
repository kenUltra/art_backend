const express = require("express");
const employeeRoute = express.Router();
const employeeController = require("../controller/employee.cjs");
const { userRoles } = require("../configs/roles.cjs");
const roles = require("../middleware/checkRole.cjs");

employeeRoute.route("/employee").get(roles(userRoles.Executive, userRoles.Manager), employeeController.getEmployees);

employeeRoute.route("/employee/:uuid")
    .get(roles(userRoles.User, userRoles.betaUser), employeeController.getEmployee)
    .post(roles(userRoles.betaUser,userRoles.User, userRoles.Executive, userRoles.Manager), employeeController.addEmployee)
    .delete(roles(userRoles.Manager, userRoles.Executive), employeeController.deletEmployee)
    .put(roles(userRoles.User, userRoles.betaUser, userRoles.Executive, userRoles.Manager), employeeController.updateCo_Employee);

module.exports = employeeRoute;
