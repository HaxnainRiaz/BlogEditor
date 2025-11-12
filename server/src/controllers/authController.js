const { validationResult } = require('express-validator');
const jwt = require('jsonwebtoken');
const User = require('../models/User');

const COOKIE_NAME = process.env.COOKIE_NAME || 'auth_token';
const COOKIE_SECURE = (process.env.COOKIE_SECURE || '').toLowerCase() === 'true';
const COOKIE_DOMAIN = process.env.COOKIE_DOMAIN || undefined;

const buildCookieOptions = () => ({
  httpOnly: true,
  sameSite: COOKIE_SECURE ? 'none' : 'lax',
  secure: COOKIE_SECURE,
  maxAge: 7 * 24 * 60 * 60 * 1000,
  ...(COOKIE_DOMAIN ? { domain: COOKIE_DOMAIN } : {}),
});

const issueToken = (user) =>
  jwt.sign(
    {
      userId: user.id,
      email: user.email,
    },
    process.env.JWT_SECRET,
    { expiresIn: '7d' }
  );

exports.signup = async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ error: 'Validation failed', details: errors.array() });
    }

    const { username, email, password } = req.body;
    const existingUser = await User.findOne({ email: email.toLowerCase() });
    if (existingUser) {
      return res.status(409).json({ error: 'Email already registered' });
    }

    const user = await User.create({ username, email, password });

    res.status(201).json({
      message: 'Account created successfully',
      user: user.toSafeJSON(),
    });
  } catch (err) {
    next(err);
  }
};

exports.login = async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ error: 'Validation failed', details: errors.array() });
    }

    const { email, password } = req.body;
    const user = await User.findOne({ email: email.toLowerCase() }).select('+password');
    if (!user) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    const token = issueToken(user);
    res.cookie(COOKIE_NAME, token, buildCookieOptions());

    res.json({
      message: 'Login successful',
      user: user.toSafeJSON(),
    });
  } catch (err) {
    next(err);
  }
};

exports.me = async (req, res) => {
  res.json({ user: req.user.toSafeJSON() });
};

exports.logout = async (req, res) => {
  res.clearCookie(COOKIE_NAME, buildCookieOptions());
  res.json({ message: 'Logged out' });
};

