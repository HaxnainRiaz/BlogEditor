import express from 'express';
import authMiddleware from '../middleware/authMiddleware.js';
import {
  listBlogs,
  getUserBlogs,
  createBlog,
  updateBlog,
  deleteBlog,
} from '../controllers/blogController.js';

const router = express.Router();

router.get('/', listBlogs);
router.get('/mine', authMiddleware, getUserBlogs);
router.post('/', authMiddleware, createBlog);
router.put('/:id', authMiddleware, updateBlog);
router.delete('/:id', authMiddleware, deleteBlog);

export default router;


