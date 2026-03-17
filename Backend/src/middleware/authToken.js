const jwt = require("jsonwebtoken");
const env = require("dotenv");
env.config();

const authToken = async(req, res, next) => {
    try {
        const { token } = req.cookies;
        if (!token) {
            return res.status(401).json({error : "Invalid Token - Try Again."});
        }

        const decodedData = jwt.verify(token, process.env.JWT_SECRET_KEY);
        const userId = decodedData.userId;
        if (!userId) {
            return res.status(401).json({error : "Invalid Token - Try Again."});
        } else {
            req.userId = userId;
            next();
        }

    } catch (error) {
        console.error("Error during verification:", error);
        res.status(500).json({ error: "Internal server error" });
    }; 
}

module.exports = authToken;