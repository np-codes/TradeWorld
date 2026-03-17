const jwt = require('jsonwebtoken');
const env = require('dotenv');
env.config();

const generateJWT = (userId) => {
    const payload = { userId };
    const secretKey = process.env.JWT_SECRET_KEY;
    const options = { expiresIn: '2d' };
    return jwt.sign(payload, secretKey, options);
};

module.exports = { generateJWT };