const { droptestTable, createTestTable } = require("./test_schema");
const { createUserTable, dropUserTable, createPendingUsersTable, dropPendingUsersTable } = require("./user_table");
const { createOTPVerificationTable, dropOTPVerificationTable } = require("./otp_verification_table");

const db = require("../config");

const run = async () => {

    if (process.env.NODE_ENV === "production") {
        console.log("DB control disabled in production");
        process.exit(0);
    }

    const action = process.argv[2];

    try {
        // Usage:node src/models/control_models.js drop:test
        if (action.includes("create:test")) await createTestTable();
        if (action.includes("drop:test")) await droptestTable();
        if (action.includes("create:user")) {
            await createUserTable();
            await createPendingUsersTable();
        }
        if (action.includes("drop:user")) {
            await dropUserTable();
            await dropPendingUsersTable();
        }
        if (action.includes("create:otp")) await createOTPVerificationTable();
        if (action.includes("drop:otp")) await dropOTPVerificationTable();

        console.error("Error in control_models:", err.message);

    } finally {
        db.end(err => {
            if (err) {
                console.error("Error closing the database connection:", err.message);
            } else {
                console.log("Database connection closed.");
            }       
        });
    }
}

run();