const express = require('express');
const { body } = require('express-validator');
const authMiddleware = require('../middleware/authMiddleware');
const blogController = require('../controllers/blogController');

const router = express.Router();

router.get('/', blogController.listBlogs);
router.get('/:id', blogController.getBlog);

router.post(
  '/',
  authMiddleware,
  [
    body('title')
      .trim()
      .isLength({ min: 3, max: 200 })
      .withMessage('Title must be between 3 and 200 characters'),
    body('content').isString().notEmpty().withMessage('Content is required'),
    body('tags')
      .optional()
      .isArray({ max: 10 })
      .withMessage('Tags must be an array with up to 10 items'),
  ],
  blogController.createBlog
);

router.put('/:id', authMiddleware, blogController.updateBlog);
router.delete('/:id', authMiddleware, blogController.deleteBlog);

module.exports = router;

