const db = require('../config');
const util = require('util');
const queryAsync = util.promisify(db.query).bind(db);
const bcrypt = require('bcrypt');
const express = require("express");
const router = express.Router();

const { validateFields, validateBirthDate, validatePhoneNum, validateEmail, isStrongPassword } = require('../utils/signupValidators');

router.post("/user/register", async (req, res) => {
    try{
        const user = req.body;
        if(!validateFields(user)) {
            return res.status(400).json({ error: "All fields are required" });
        }

        if(!validateBirthDate(user.birthDate)) {
            return res.status(400).json({ error: "Invalid Birth Date" });
        }

        if(!validatePhoneNum(user.phoneNum)) {
            return res.status(400).json({ error: "Invalid Phone Number" });
        }

        if(!validateEmail(user.emailId)) {
            return res.status(400).json({ error: "Invalid Email" });
        }

        if(!isStrongPassword(user.password)) {
            return res.status(400).json({ error: "Weak Password" });
        }

        // console.log("All validations passed");
        // return res.status(200).json({ message: "All validations passed" }); 
       
    
        const { firstName, lastName, birthDate, userName, emailId, phoneNum, password } = user;
        const passwordHash = await bcrypt.hash(password, 10);

        // Check for existing user with same email, username, or phone number
        const existingUserQuery = "SELECT * FROM USERS WHERE email_Id = ? OR user_Name = ? OR phone_Num = ?";
        const existingUsers = await queryAsync(existingUserQuery, [emailId, userName, phoneNum]);

        if(existingUsers.length > 0) {
            return res.status(400).json({ error: "Try Using Different Email, Username, and Phone Number" });
        }

        const existingPendingUserQuery = "SELECT * FROM PENDING_USERS WHERE email_Id = ? OR user_Name = ? OR phone_Num = ?";
        const existingPendingUsers = await queryAsync(existingPendingUserQuery, [emailId, userName, phoneNum]);

        if(existingPendingUsers.length == 0) {
            const insertPendingUserQuery = "INSERT INTO PENDING_USERS (first_Name, last_Name, birth_Date, user_Name, email_Id, phone_Num, password, email_Verified, phone_Verified) VALUES (?, ?, ?, ?, ?, ?, ?, false, false)";
            const values = [firstName, lastName, birthDate, userName, emailId, phoneNum, passwordHash,false, false];
            await queryAsync(insertPendingUserQuery, values);
        }

        res.status(201).json({ message: "User registered pending" });
    } catch (error) {
        console.error("Error registering user:", error);
        res.status(500).json({ error: "Internal server error" });
    }
})

router.post("/user", async (req, res) => {
    try {
        // call for otp validation middleware which has same route with (req,res,next) here
        const {  userName, emailId, phoneNum } = req.body;
        const getPendingUserQuery = "SELECT * FROM PENDING_USERS WHERE user_Name = ? AND email_Id = ? AND phone_Num = ?";
        const pendingUsers = await queryAsync(getPendingUserQuery, [userName, emailId, phoneNum]);

        const {temp_User_Id, first_Name, last_Name, birth_Date,user_Name, email_Id, phone_Num, password, email_Verified, phone_Verified} = pendingUsers[0];

        if(!email_Verified || !phone_Verified) {
            return res.status(400).json({ error: "Please verify your email and phone number to complete registration" });
        }

        const values = [first_Name, last_Name, birth_Date, user_Name, email_Id, phone_Num, password];
        const insertUserQuery = "INSERT INTO USERS (first_Name, last_Name, birth_Date, user_Name, email_Id, phone_Num, password) VALUES (?, ?, ?, ?, ?, ?, ?)";
        await queryAsync(insertUserQuery, values);

        // Delete the pending user after successful registration
        const deletePendingUserQuery = "DELETE FROM PENDING_USERS WHERE temp_User_ID = ?";
        await queryAsync(deletePendingUserQuery, [temp_User_Id]);

        res.status(201).json({ message: "User registered successfully" }); 
    } catch (error) {
        console.error("Error during verification:", error);
        res.status(500).json({ error: "Internal server error" });
    }
})


module.exports = router;