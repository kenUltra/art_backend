const express = require("express");
const router = express.Router();
const authController = require("../controller/auth.cjs");
const limit = require('../middleware/loglimit.cjs');
const { verifyJWT } = require("../middleware/veriryJWT.cjs");

router.route("/auth").post(limit,authController.loging);

router.route("/auth/logout").get(verifyJWT, authController.logout);

module.exports = router;
