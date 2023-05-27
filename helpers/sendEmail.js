const sgMail = require("@sendgrid/mail");
const { login } = require("../controllers/auth");
require("dotenv").config();

const { SENDGRID_API_KEY2 } = process.env;

sgMail.setApiKey(SENDGRID_API_KEY2);

const sendEmail = async (data) => {
    const email = { ...data, from: "kyunlik@gmail.com" };
    await sgMail.send(email);
    return true;
}

module.exports = sendEmail;