const jwt = require('jsonwebtoken');
const dotenv = require('dotenv').config;

const jwtSecretKey = 'gigogranchinostof'

function generateToken(data) {
    return jwt.sign(data, jwtSecretKey)
}

function verifyToken(token){
    return jwt.verify(token, jwtSecretKey)
}

module.exports = {verifyToken, generateToken}
