const db = require('../config');
const util = require('util');
const queryAsync = util.promisify(db.query).bind(db);

const createPendingUsersTable = async () => {
    try{
        const sql = `
            CREATE TABLE IF NOT EXISTS PENDING_USERS (
                temp_User_Id INT AUTO_INCREMENT PRIMARY KEY,
                first_Name VARCHAR(100) NOT NULL,
                last_Name VARCHAR(100) NOT NULL,
                birth_Date DATE NOT NULL,
                user_Name VARCHAR(100) UNIQUE NOT NULL,
                email_Id VARCHAR(100) UNIQUE NOT NULL,
                phone_Num VARCHAR(20) UNIQUE NOT NULL,
                password_Hash VARCHAR(255) NOT NULL,
                email_Verified BOOLEAN DEFAULT FALSE,
                phone_Verified BOOLEAN DEFAULT FALSE,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            );
        `;
        await queryAsync(sql);
        console.log("Pending Users table created or already exists.");

    } catch (err) {
        console.error("Something went wrong:", err.message);
    }
};

const dropPendingUsersTable = async () => {
    try{
        const sql = `DROP TABLE IF EXISTS PENDING_USERS;`;
        await queryAsync(sql);
        console.log("Pending Users table dropped successfully.");
    } catch (err) {
        console.error("Something went wrong:", err.message);
    }
};

// -------------------------------------------------------------------------

const createUserTable = async () => {
    try{
        const sql = `
            CREATE TABLE IF NOT EXISTS USERS (
                user_Id INT AUTO_INCREMENT PRIMARY KEY,
                first_Name VARCHAR(100) NOT NULL,
                last_Name VARCHAR(100) NOT NULL,
                birth_Date DATE NOT NULL,
                user_Name VARCHAR(100) UNIQUE NOT NULL,
                email_Id VARCHAR(100) UNIQUE NOT NULL,
                phone_Num VARCHAR(20) UNIQUE NOT NULL,
                password_Hash VARCHAR(255) NOT NULL,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            );
        `;
        await queryAsync(sql);
        console.log("User table created or already exists.");

    } catch (err) {
        console.error("Something went wrong:", err.message);
    }
};

const dropUserTable = async () => {
    try{
        const sql = `DROP TABLE IF EXISTS USERS;`;
        await queryAsync(sql);
        console.log("User table dropped successfully.");
    } catch (err) {
        console.error("Something went wrong:", err.message);
    }
};


module.exports = { createUserTable, dropUserTable, createPendingUsersTable, dropPendingUsersTable };