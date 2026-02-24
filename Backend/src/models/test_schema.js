const db = require('../config');
const util = require('util');
const queryAsync = util.promisify(db.query).bind(db);

const createTestTable = async () => {
    try{
        const sql = `
            CREATE TABLE IF NOT EXISTS tests (
                id INT AUTO_INCREMENT PRIMARY KEY,
                name VARCHAR(100) NOT NULL,
                email VARCHAR(100) UNIQUE NOT NULL,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            );
        `;
        await queryAsync(sql);
        console.log("Test table created or already exists.");

    } catch (err) {
        console.error("Something went wrong:", err.message);
    }
};

const droptestTable = async () => {
    try{
        const sql = `DROP TABLE IF EXISTS tests;`;
        await queryAsync(sql);
        console.log("Test table dropped successfully.");
    } catch (err) {
        console.error("Something went wrong:", err.message);
    }
};

module.exports = { createTestTable, droptestTable };