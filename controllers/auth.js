const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { User, authSchema } = require("../models/user");
const { RequestError, ctrlWrapper } = require("../helpers");

require('dotenv').config()

const { SECRET_KEY } = process.env;

const register = async (req, res, next) => {
    const { error } = authSchema.validate(req.body);
    if (error) {
        throw RequestError(400, "Email or password is not correct");
    };
    const { email, password } = req.body;
    const user = await User.findOne({ email });

    if (user) {
        throw RequestError(409, "Email in use")
    }

    const hashPassword = await bcrypt.hash(password, 10);

    const newUser = await User.create({...req.body, password: hashPassword});

    res.status(201).json({
        user: {
            email: newUser.email,
            subscription: "starter",
        }
    })
}

const login = async (req, res, next) => {
    const { error } = authSchema.validate(req.body);
    if (error) {
        throw RequestError(400, "Email or password is not correct");
    };

    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user) {
        throw RequestError(401, "Email or password is wrong")
    }
    const passwordCompare = await bcrypt.compare(password, user.password);
    if (!passwordCompare) {
        throw RequestError(401, "Email or password is wrong") 
    }

    const payload = {
        id: user._id,
    }

    const token = jwt.sign(payload, SECRET_KEY, { expiresIn: "23h" });
    await User.findByIdAndUpdate(user._id, { token });

    res.status(200).json({
        token: token,
        user: {
            email: user.email,
            subscription: "starter"
        }
    });
}

const logout = async (req, res, next) => {
    const { _id } = req.user;
    const user = User.findOne({ _id });
    if (!user) {
        throw RequestError(401, "Not authorized");
    }

    await User.findByIdAndUpdate(_id, { token: "" });

    res.status(204).json()
}

const getCurrent = async (req, res, next) => {
    const { email, subscription } = req.user;

    res.json({
        email,
        subscription,
    })
}

module.exports = {
    register: ctrlWrapper(register),
    login: ctrlWrapper(login),
    logout: ctrlWrapper(logout),
    getCurrent: ctrlWrapper(getCurrent),
}