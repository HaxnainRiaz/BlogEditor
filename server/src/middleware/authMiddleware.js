const jwt = require('jsonwebtoken');
const User = require('../models/User');

const COOKIE_NAME = process.env.COOKIE_NAME || 'auth_token';

const authMiddleware = async (req, res, next) => {
  try {
    const token = req.cookies?.[COOKIE_NAME];
    if (!token) {
      return res.status(401).json({ error: 'Authentication required' });
    }

    const payload = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(payload.userId);
    if (!user) {
      return res.status(401).json({ error: 'Invalid session' });
    }

    req.user = user;
    next();
  } catch (err) {
    console.error('Auth middleware error:', err);
    res.status(401).json({ error: 'Authentication required' });
  }
};

module.exports = authMiddleware;

