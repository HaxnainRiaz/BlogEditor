import Blog from '../models/Blog.js';

const stripHtml = (html = '') =>
  html
    .replace(/<script[\s\S]*?>[\s\S]*?<\/script>/gi, '')
    .replace(/<style[\s\S]*?>[\s\S]*?<\/style>/gi, '')
    .replace(/<\/?[^>]+(>|$)/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();

export const listBlogs = async (_req, res) => {
  try {
    const blogs = await Blog.find()
      .populate('user', 'username email')
      .sort({ createdAt: -1 })
      .lean();

    res.json({
      blogs: blogs.map((blog) => ({
        ...blog,
        id: blog._id,
        excerpt: blog.excerpt ?? stripHtml(blog.content).slice(0, 300),
      })),
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const getUserBlogs = async (req, res) => {
  try {
    const blogs = await Blog.find({ user: req.userId })
      .populate('user', 'username email')
      .sort({ createdAt: -1 })
      .lean();

    res.json({
      blogs: blogs.map((blog) => ({
        ...blog,
        id: blog._id,
        excerpt: blog.excerpt ?? stripHtml(blog.content).slice(0, 300),
      })),
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const createBlog = async (req, res) => {
  try {
    const { title, content, tags } = req.body;
    if (!title || !content) {
      return res.status(400).json({ error: 'Title and content are required' });
    }

    const blog = await Blog.create({
      title,
      content,
      tags,
      excerpt: stripHtml(content).slice(0, 300),
      user: req.userId,
    });

    await blog.populate('user', 'username email');

    res.status(201).json({
      blog: {
        ...blog.toObject(),
        id: blog._id,
      },
      message: 'Blog created successfully',
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const updateBlog = async (req, res) => {
  try {
    const updates = { ...req.body };
    if (typeof updates.content === 'string') {
      updates.excerpt = stripHtml(updates.content).slice(0, 300);
    }

    const blog = await Blog.findOneAndUpdate(
      { _id: req.params.id, user: req.userId },
      updates,
      { new: true }
    ).populate('user', 'username email');

    if (!blog) return res.status(404).json({ error: 'Blog not found' });

    res.json({
      blog: {
        ...blog.toObject(),
        id: blog._id,
      },
      message: 'Blog updated successfully',
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const deleteBlog = async (req, res) => {
  try {
    const blog = await Blog.findOneAndDelete({ _id: req.params.id, user: req.userId });
    if (!blog) return res.status(404).json({ error: 'Blog not found' });
    res.json({ message: 'Blog deleted' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

