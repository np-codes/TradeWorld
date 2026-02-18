const express = require("express");
const mysql = require("mysql");
const db = require("./config");
const app = express();
app.use(express.json());

// Importing APIS files from routes folder
const testRoutes = require("./routes/test_apis");
const userRoutes = require("./routes/user_apis");

// Using the imported routes
app.use("/", testRoutes, userRoutes);

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

