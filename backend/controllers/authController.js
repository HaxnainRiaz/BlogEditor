import User from '../models/User.js';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

export const signup = async (req, res) => {
  const { username, email, password } = req.body;
  try {
    const existingUser = await User.findOne({ $or: [{ username }, { email }] });
    if (existingUser) {
      return res.status(400).json({ error: 'Username or email already exists' });
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = new User({ username, email, password: hashedPassword });
    await user.save();
    res.status(201).json({ message: 'User registered successfully!' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const login = async (req, res) => {
  // Accept either email or username in the same field `email`
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ $or: [{ email }, { username: email }] });
    if (!user) return res.status(400).json({ error: 'Invalid credentials' });
    const valid = await bcrypt.compare(password, user.password);
    if (!valid) return res.status(400).json({ error: 'Invalid credentials' });
    const token = jwt.sign({ userId: user._id, username: user.username, email: user.email }, process.env.JWT_SECRET, { expiresIn: '7d' });
    const isProd = process.env.NODE_ENV === 'production';
    res.cookie('token', token, {
      httpOnly: true,
      secure: isProd,
      sameSite: isProd ? 'none' : 'lax',
      maxAge: 7 * 24 * 60 * 60 * 1000,
      path: '/',
    });
    res.json({ message: 'Login successful' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const me = async (req, res) => {
  // req.user is set by auth middleware
  if (!req.user) return res.status(401).json({ error: 'Unauthenticated' });
  res.json({ user: req.user });
};

export const logout = async (_req, res) => {
  res.clearCookie('token', { path: '/' });
  res.json({ message: 'Logged out' });
};


