const jwt = require('jsonwebtoken');
require('dotenv').config();

// exports.authenticateToken = (req, res, next) => {
//   const authHeader = req.headers['authorization'];
//   const token = authHeader && authHeader.split(' ')[1];

//   if (!token) return res.status(401).json({ success: false, error: { message: 'Token required' } });

//   jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
//     if (err) return res.status(403).json({ success: false, error: { message: 'Invalid token' } });
//     req.user = user;
//     next();
//   });
// };



const authenticateToken = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) {
        return res.status(401).json({ 
            success: false, 
            data: null, 
            error: { message: 'Access denied: No token provided' } 
        });
    }

    try {
        const verified = jwt.verify(token, process.env.JWT_SECRET);
        req.user = verified;
        next();
    } catch (error) {
        return res.status(403).json({ 
            success: false, 
            data: null, 
            error: { message: 'Invalid token' } 
        });
    }
};

module.exports = { authenticateToken };

