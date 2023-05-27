const express = require("express");
const user = require("../../controllers/auth");
const { authenticate, upload } = require("../../middlewares");

const router = express.Router();

router.post("/register", user.register);

router.get("/verify/:verificationToken", user.verifyEmail);

router.post("/verify", user.resendVerifyEmail);

router.post("/login", user.login);

router.post("/logout", authenticate, user.logout);

router.get("/current", authenticate, user.getCurrent);

router.patch("/avatars", authenticate, upload.single("avatar"), user.updateAvatar);

module.exports = router;