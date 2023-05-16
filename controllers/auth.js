const { User } = require("../models/user");

const { RequestError, ctrlWrapper } = require("../helpers");

const register = async (req, res) => {
    const { email } = req.body;
    const user = await User.findOne({ email });

    if (user) {
        throw RequestError(409, {"message": "Email in use"})
    }

    const newUser = await User.create(req.body);

    res.status(201).json({
        email: newUser.email,
        name: newUser.name,
    })
}

module.exports = {
    register: ctrlWrapper(register),
}