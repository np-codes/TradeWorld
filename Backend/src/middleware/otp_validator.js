const otpValidater = (req, res, next) => {
    try{

    } catch (error) {
        console.error("Error validating OTP:", error);
        res.status(500).json({ error: "Internal server error" });
    }
}

module.exports = otpValidater;