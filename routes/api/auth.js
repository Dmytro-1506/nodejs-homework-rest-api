const express = require("express");
const auth = require("../../controllers/auth");
const { authenticate } = require("../../middlewares");

const router = express.Router();

router.post("/register", auth.register);

router.post("/login", auth.login)

router.post("/logout", authenticate, auth.logout);

router.get("/current", authenticate, auth.getCurrent)

module.exports = router;