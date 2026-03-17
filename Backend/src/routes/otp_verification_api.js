const db = require('../config');
const util = require('util');
const queryAsync = util.promisify(db.query).bind(db);
const bcrypt = require('bcrypt');
const express = require("express");
const router = express.Router();
const generateOTP = require('../utils/otpGenerator');
const { sendEmailOTP } = require('../services/mailService');

// req.body = { emailId: "<email>" , userType: "pending" or "registered" , contactType: "email" or "phone" }

router.post("/user/send-email-otp", async (req, res) => {
    try {
        const { emailId, userType, contactType } = req.body;
        const query = userType === "pending" 
            ? "SELECT temp_User_Id AS user_Id FROM pending_users WHERE email_Id = ?" 
            : "SELECT user_Id FROM users WHERE email_Id = ?";

        const user = await queryAsync(query, [emailId]);
        if (!user || user.length === 0) {
            return res.status(404).json({ error: "User not found" });
        }
        console.log("User found:", user);
        // check if otp already exists for the user and contact type, if yes delete it before creating new one
        const userId = user[0].user_Id;
        const deleteOtpQuery = "DELETE FROM OTPS WHERE user_Id = ? AND contact_Type = ?";
        await queryAsync(deleteOtpQuery, [userId, contactType]);

        const otp = generateOTP();
        console.log("Generated OTP:", otp);
        const otpHash = await bcrypt.hash(otp, 10);
        // OTP valid for 5 minutes.
        const expiresAt = new Date(Date.now() + 5 * 60 * 1000); 
        
        const insertQuery = "INSERT INTO OTPS (user_Type, user_Id, contact_Type, otp_Hash, expires_At) VALUES (?, ?, ?, ?, ?) ";
        await queryAsync(insertQuery, [userType, userId, contactType, otpHash, expiresAt]);
        
        const getRecordQuery = "SELECT otp_Id FROM OTPS WHERE user_Id = ? AND contact_Type = ?";
        const otpRecord = await queryAsync(getRecordQuery, [userId, contactType]);
        console.log("OTP record inserted:", otpRecord);
        await sendEmailOTP(emailId, otp);
        res.json({ 
            message: "OTP sent successfully",
            otpId: otpRecord[0]?.otp_Id
        });

    } catch (error) {
        console.error("Error verifying OTP:", error);
        res.status(500).json({ error: "Internal server error" });
    }   
});

//req.body = { otpId: "<otpId>", otpInput: "<otp>", userType: "pending" or "registered"} 
router.post("/user/verify-otp", async (req, res) => {
    try {
        const { otpId, otpInput, userType } = req.body;
        const getOtpQuery = "SELECT * FROM OTPS WHERE otp_Id = ? ";
        const otpRecords = await queryAsync(getOtpQuery, [otpId]);
        if (!otpRecords || otpRecords.length === 0) {
            return res.status(404).json({ error: "OTP Expired" });
        }
        const { otp_Hash, user_Id, expires_At, contact_Type } = otpRecords[0];
        if (new Date() > expires_At) {
            return res.status(400).json({ error: "OTP Expired" });
        }

        const isOtpValid = await bcrypt.compare(otpInput, otp_Hash);
        if (!isOtpValid) {
            return res.status(400).json({ error: "Invalid OTP" });
        }
        const updateVerifiedQuery = " UPDATE OTPS SET verified = true WHERE otp_Id = ?";
        await queryAsync(updateVerifiedQuery, [otpId]);

        if (userType === "pending") {
            const updateVerificationQuery = `UPDATE PENDING_USERS SET ${contact_Type}_Verified = true WHERE temp_User_Id = ?`;
            await queryAsync(updateVerificationQuery, [user_Id]);
        }

        res.json({ 
            message: "OTP verified successfully",
            userId: user_Id, 
            verificationType : contact_Type,
            verificationStatus: true
         });

    } catch (error) {
        console.error("Error verifying OTP:", error);
        res.status(500).json({ error: "Internal server error" });
    }
});


router.post("/user/verify-phone", async (req, res) => {
    try {

    } catch (error) {
        console.error("Error verifying OTP:", error);
        res.status(500).json({ error: "Internal server error" });
    }
});

module.exports = router;