const jwt = require('jsonwebtoken');
require("dotenv").config("../../.env")

var { expressjwt: jwtMw } = require("express-jwt");

const SECRET_KEY = process.env.JWT_SECRET_KEY; // Use a strong secret key
// Function to generate a JWT token
function generateToken(user) {
    return jwt.sign({ id: user.id, email: user.email }, SECRET_KEY, { expiresIn: '24h' });
}
// JWT Middleware to protect routes
const jwtMiddleware = jwtMw({
    secret: SECRET_KEY,
    algorithms: ['HS256'],
    requestProperty: 'user', // The decoded token payload will be available on `req.user`
});

// Function to verify the JWT token manually if needed
function verifyToken(token) {
    return jwt.verify(token, SECRET_KEY);
}

module.exports = { generateToken, jwtMiddleware, verifyToken };
