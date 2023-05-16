const express = require("express");
const auth = require("../../controllers/auth");

const router = express.Router();

router.post("/register", (req, res) => {
    auth.register(req, res);
})

module.exports = router;