// Import middleware/ dependancies
const jwt = require("jsonwebtoken");
const dotEnv = require("dotenv");
// Environment setting
dotEnv.config();
const JWTKEY = process.env.JWTKEY;

// Fuction to verify token received from client
// Callers: apiRoutes/userRoutes.js
const tokenVerification = async (req, res, next) => {
    // Get token received in header from client
    let token = req.headers["authorization"];
    // If token exist
    if (token) {
        // Split token from "bearer" text
        token = token.split(" ")[1];
        
        // Verify token with JWTKEY
        jwt.verify(token, JWTKEY, (err) => {
            // If error occurred
            if (err) {
                res.send({ code: 417, message: `Token: Expectation failed ${err}` });
            }
            // Token verified now do further
            else { next(); }
        })
    }
    else { res.send({ code: 204, message: "Token: No content" }) } // If token not exsist
}

module.exports = tokenVerification;