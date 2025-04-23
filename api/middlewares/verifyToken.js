const JWT = require('jsonwebtoken')


const verifyToken = (req, res, next) => {
    try {
        const token = req.cookies.token;
        if (!token) return res.status(401).json({ success: false, message: "Access denied. No token provided." });
        const decode = JWT.verify(token, process.env.jwtSecretKey);
        req.user = decode;
        next();
    } catch (error) {
        res.status(401).json({ success: false, message: "Invalid or expired token." });
    }
}
module.exports = { verifyToken }