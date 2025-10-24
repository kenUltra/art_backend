const express = require("express");
const router = express.Router();
const { verifyJWT } = require("../middleware/veriryJWT.cjs");
const userController = require("../controller/user.cjs");
const roles = require('../middleware/checkRole.cjs');
const {userRoles} = require('../configs/roles.cjs')

router.route("/user")
    .get(verifyJWT,roles(userRoles.Executive, userRoles.Manager) ,userController.getUsers)
    .post(userController.creatUser);

router.route("/pages/:userId")
     .get(verifyJWT, roles(userRoles.User, userRoles.betaUser,userRoles.Manager), userController.getUser)
     .patch(verifyJWT, roles(userRoles.User, userRoles.Executive), userController.updateUserName)
     .delete(verifyJWT, roles(userRoles.betaUser, userRoles.Manager), userController.deleteUser)

module.exports = router;
