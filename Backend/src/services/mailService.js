const nodeMailer = require('nodemailer');
const OTPEmailTemplate = require('../templates/otpEmailTemplate');
require('dotenv').config();

const transporter = nodeMailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
    }
});

async function sendEmailOTP(toEmail, otpCode) {
    try {
        const htmlContent = OTPEmailTemplate(otpCode);
        const mailOptions = {
            from: process.env.EMAIL_USER,
            to: toEmail,
            subject: 'TradeWorld OTP Code',
            html: htmlContent
        };

        await transporter.sendMail(mailOptions);

    } catch (error) {
        console.error("Error sending email OTP:", error);
        throw new Error("Failed to send email OTP");
    }
}

module.exports = { sendEmailOTP };