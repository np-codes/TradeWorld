const express = require("express");
const mysql = require("mysql");
const db = require("./config");
const app = express();
app.use(express.json());

// Importing APIS files from routes folder
const userRoutes = require("./routes/user_apis");
const otpRoutes = require("./routes/otp_verification_api");

// Using the imported routes
app.use("/", userRoutes, otpRoutes);

db.connect((err) => {
    if (err) {
        console.error('Database connection failed: ' + err.message);
        process.exit(1);
    }   
    console.log('Connected to database.');

    app.listen(3000, () => {
        console.log("Server is running at port 3000");
    })
})

