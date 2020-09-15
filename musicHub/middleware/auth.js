const jwt = require('jsonwebtoken');

module.exports = (req, res, next) => {
    try {
        const token = req.headers.authorization.split(" ")[1];
        const decoded = jwt.verify(token, process.env.JWT_PASS);
        req.userData = decoded;
        next();
    } catch (error) {
        return res.status(401).json({
            message: 'You are not logged in or authentication failed.'
        });
    }
};