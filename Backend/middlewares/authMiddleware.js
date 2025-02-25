const jwt = require('jsonwebtoken');
const { ObjectId } = require('mongodb');
require('dotenv').config();

const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({
      success: false,
      data: null,
      error: { message: 'Access denied: No token provided' },
    });
  }

  try {
    const verified = jwt.verify(token, process.env.JWT_SECRET);
    req.user = { userId: new ObjectId(verified.userId) }; // Convert to ObjectId
    next();
  } catch (error) {
    return res.status(403).json({
      success: false,
      data: null,
      error: { message: 'Invalid token' },
    });
  }
};

module.exports = { authenticateToken };