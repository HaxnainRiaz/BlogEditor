const express = require('express');
const { body } = require('express-validator');
const authMiddleware = require('../middleware/authMiddleware');
const authController = require('../controllers/authController');

const router = express.Router();

router.post(
  '/signup',
  [
    body('username')
      .trim()
      .isLength({ min: 2, max: 60 })
      .withMessage('Username must be between 2 and 60 characters'),
    body('email').isEmail().withMessage('A valid email address is required'),
    body('password')
      .isLength({ min: 8 })
      .withMessage('Password must be at least 8 characters long'),
  ],
  authController.signup
);

router.post(
  '/login',
  [
    body('email').isEmail().withMessage('A valid email address is required'),
    body('password').notEmpty().withMessage('Password is required'),
  ],
  authController.login
);

router.get('/me', authMiddleware, authController.me);

router.post('/logout', authMiddleware, authController.logout);

module.exports = router;

