const express = require("express");
const Routes = express.Router();

const commentController = require("../controller/comment.cjs");
const { userRoles } = require("../configs/roles.cjs");
const role = require("../middleware/checkRole.cjs");

Routes.route("/comment/:uuid")
    .get(role(userRoles.User, userRoles.Executive), commentController.getComment)
    .post(role(userRoles.User, userRoles.Executive, userRoles.Manager), commentController.makeComment)
    .delete(role(userRoles.Executive, userRoles.User), commentController.deleteComment)
    .patch(commentController.likeComment);

module.exports = Routes;
