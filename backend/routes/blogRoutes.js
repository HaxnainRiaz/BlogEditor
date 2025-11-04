import express from 'express';
import authMiddleware from '../middleware/authMiddleware.js';
import {
  createBlog,
  getUserBlogs,
  updateBlog,
  deleteBlog
} from '../controllers/blogController.js';

const router = express.Router();

router.use(authMiddleware);

router.post('/', createBlog);
router.get('/', getUserBlogs);
router.put('/:id', updateBlog);
router.delete('/:id', deleteBlog);

export default router;

