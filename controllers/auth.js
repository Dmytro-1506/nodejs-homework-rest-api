const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { User, authSchema, emailSchema } = require("../models/user");
const { RequestError, ctrlWrapper, sendEmail } = require("../helpers");
const gravatar = require("gravatar");
const path = require("path");
const fs = require("fs/promises");
const {v4} = require("uuid")

require('dotenv').config()

const { SECRET_KEY, BASE_URL } = process.env;

const avatarsDir = path.join(__dirname, "../", "public", "avatars");

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
    
    const avatarURL = gravatar.url(email);
    const hashPassword = await bcrypt.hash(password, 10);
    const verificationToken = v4();
    
    const newUser = await User.create({ ...req.body, password: hashPassword, avatarURL, verificationToken });
    
    const verifyEmail = {
        to: email,
        subject: "Verify email",
        html: `<a target="_blank" href="${BASE_URL}/api/users/verify/${verificationToken}">Click verify email</a>`
    }

    await sendEmail(verifyEmail);

    res.status(201).json({
        user: {
            email: newUser.email,
            subscription: "starter",
        }
    })
}

const verifyEmail = async (req, res) => {
    const { verificationToken } = req.params;
    const user = await User.findOne({ verificationToken });
    if (!user) {
        console.log(verificationToken);
        throw RequestError(404, 'User not found')
    }

    await User.findByIdAndUpdate(user._id, { verify: true, verificationToken: "" })
    
    res.json({
        message: 'Verification successful'
    })
}

const resendVerifyEmail = async (req, res) => {
    const { error } = emailSchema.validate(req.body);
    if (error) {
        throw RequestError(400, "missing required field email");
    };

    const { email } = req.body;
    const user = await User.findOne({ email });
    if (!user) {
        throw RequestError(404, 'User not found')
    };
    if (user.verify) {
        throw RequestError(400, "Verification has already been passed")
    };

    const verifyEmail = {
        to: email,
        subject: "Verify email",
        html: `<a target="_blank" href="${BASE_URL}/api/users/verify/${user.verificationToken}">Click verify email</a>`
    }

    await sendEmail(verifyEmail);

    res.status(200).json({
        "message": "Verification email sent"
    })
}

const login = async (req, res, next) => {
    const { error } = authSchema.validate(req.body);
    if (error) {
        throw RequestError(400, "Email or password is not correct");
    };

    if (!user.verify) {
        throw RequestError(404, 'User not found');
    }

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

const updateAvatar = async (req, res, next) => {
    const { _id } = req.user;
    const { path: tmpDir, originalname } = req.file;
    const resultUpload = path.join(avatarsDir, originalname);
    await fs.rename(tmpDir, resultUpload);
    const avatarURL = path.join("avatars", originalname);
    await User.findByIdAndUpdate(_id, { avatarURL });

    res.json({
        avatarURL,
    })
};

module.exports = {
    register: ctrlWrapper(register),
    verifyEmail: ctrlWrapper(verifyEmail),
    resendVerifyEmail: ctrlWrapper(resendVerifyEmail),
    login: ctrlWrapper(login),
    logout: ctrlWrapper(logout),
    getCurrent: ctrlWrapper(getCurrent),
    updateAvatar: ctrlWrapper(updateAvatar),
}