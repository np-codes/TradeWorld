const db = require('../config');
const util = require('util');
const queryAsync = util.promisify(db.query).bind(db);

const express = require("express");
const router = express.Router();

router.post("/test/insert", async (req, res) => {
    try {
        const {name, email} = req.body;
        if(!name || !email) {
            return res.status(400).json({ error: "Name and email are required" });
        }
        const sql = `INSERT INTO tests (name, email) VALUES ('${name}', '${email}')`;
        await queryAsync(sql);
        return res.json({ 
            message: "Test record inserted successfully" 
        });
    } catch (err) {
        res.status(400).json ({ 
            error: "Error Occurred", 
            message: err.message 
        })
    }
});

module.exports = router;