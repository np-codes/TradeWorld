const db = require('../config');
const util = require('util');
const queryAsync = util.promisify(db.query).bind(db);

const createOTPTable = async () => {
    try{
        const sql = `
            CREATE TABLE IF NOT EXISTS OTPS (
                otp_Id INT AUTO_INCREMENT PRIMARY KEY,
                user_Type ENUM('pending', 'registered') NOT NULL,
                user_Id INT NOT NULL,
                contact_Type ENUM('email', 'phone') NOT NULL,
                otp_Hash VARCHAR(60) NOT NULL,
                verified BOOLEAN DEFAULT FALSE,
                expires_At DATETIME NOT NULL,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            );
        `;
        await queryAsync(sql);
        console.log("OTP table created or already exists.");

    } catch (err) {
        console.error("Something went wrong:", err.message);
    }
};

const dropOTPTable = async () => {
    try{
        const sql = `DROP TABLE IF EXISTS OTPS;`;
        await queryAsync(sql);
        console.log("OTP table dropped successfully.");
    } catch (err) {
        console.error("Something went wrong:", err.message);
    }
};

module.exports = { createOTPTable, dropOTPTable };