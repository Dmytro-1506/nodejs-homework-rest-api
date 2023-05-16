const { Schema, model } = require("mongoose");

// const emaiRegexp = /^\w+();

const userSchema = new Schema({
    name: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
    },
    password: {
        type: String,
        minlength: 6,
        required: true,
    }
}, { versionKey: false, timestamps: true });

