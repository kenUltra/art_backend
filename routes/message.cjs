const express = require("express");
const routerExpress = express.Router();
const messageController = require("../controller/message.cjs");
const { userRoles } = require("../configs/roles.cjs");
const roles = require("../middleware/checkRole.cjs");

routerExpress.route("/post/:uuid")
        .get(roles(userRoles.User, userRoles.betaUser, userRoles.Executive, userRoles.Manager),messageController.getMessages)
        .post(messageController.postMessage)
        .delete(roles(userRoles.betaUser, userRoles.User, userRoles.Manager), messageController.deleteMessage)
        .patch(roles(userRoles.User, userRoles.Manager), messageController.updateCommentName);

 routerExpress.route('/post/like/:uuid').patch(roles(userRoles.betaUser, userRoles.User, userRoles.Executive, userRoles.Manager), messageController.likeMessage)       

module.exports = routerExpress;
