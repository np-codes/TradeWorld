const db = require('../config');
const util = require('util');
const queryAsync = util.promisify(db.query).bind(db);

const createOTPVerificationTable = async () => {
    try{
        const sql = `
            CREATE TABLE IF NOT EXISTS OTP_VERIFICATION (
                otp_ID INT AUTO_INCREMENT PRIMARY KEY,
                tmp_user_ID INT NOT NULL,
                contact_Type ENUM('email', 'phone') NOT NULL,
                otp_Code INT(6) NOT NULL,
                verified BOOLEAN DEFAULT FALSE,
                expires_At DATETIME NOT NULL,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            );
        `;
        await queryAsync(sql);
        console.log("OTP Verification table created or already exists.");

    } catch (err) {
        console.error("Something went wrong:", err.message);
    }
};

const dropOTPVerificationTable = async () => {
    try{
        const sql = `DROP TABLE IF EXISTS OTP_VERIFICATION;`;
        await queryAsync(sql);
        console.log("OTP Verification table dropped successfully.");
    } catch (err) {
        console.error("Something went wrong:", err.message);
    }
};

module.exports = { createOTPVerificationTable, dropOTPVerificationTable };