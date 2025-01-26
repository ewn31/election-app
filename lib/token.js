const jwt = require('jsonwebtoken');
const dotenv = require('dotenv')

dotenv.config();

const jwtSecretKey = process.env.JWTSECERETKEY


function generateToken(data) {
    return jwt.sign(data, jwtSecretKey, {expiresIn:(60*60*24)});
}

function verifyToken(token){
    return jwt.verify(token, jwtSecretKey)
}

module.exports = {verifyToken, generateToken}
