const jwt = require("jsonwebtoken")
require("dotenv").config()

// Verify the token of the user, is is it okay, then continue to the next function  
const auth = (req, res, next) => {
    const token = req.headers["x-access-token"]
    if(!token) {
        return res.status(400).json("Not authenticated")
    }
    try {
        const tokenData = jwt.verify(token, process.env.JWT_KEY)
        next()
    }
    catch(ex) {
        return res.status(400).json("Invalid token")
    }
}

module.exports = auth;